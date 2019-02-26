export const eachWithIndex = (ary, func) => {
  let idx = 0;
  return ary.map(item => {
    return func(item, idx++);
  });
};

export const mapWithIndex = (ary, func) => {
  let idx = 0;
  return ary.map(item => {
    return func(item, idx++);
  });
};

export const eachWithIndexNotMap = (ary, func) => {
  let idx = 0;
  return ary.forEach(item => {
    return func(item, idx++);
  });
};

export const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const commonGetDerivedStateFromProps = (nextProps, prevState) => {
  let keys = Object.keys(prevState.importantPropsSnapshot);

  let tmp = keys.filter(key => {
    return prevState.importantPropsSnapshot[key] === nextProps[key];
  });

  if (
    /*
    keys.filter(key => {
      return prevState.importantPropsSnapshot[key] === nextProps[key];
    }).length === keys.length
    */
    tmp.length === keys.length
  ) {
    return null;
  } else {
    let newImportantPropsSnapshot = {};
    keys.forEach(key => {
      newImportantPropsSnapshot[key] = nextProps[key];
    });

    /* will be merged to state */
    return {
      version: prevState.version + 1,
      importantPropsSnapshot: newImportantPropsSnapshot
    };
  }

  return null;
};

export const withoutPx = str => {
  return Number(str.replace(/ *px$/, ""));
};

export const cloneObjectSimple = originalObj => {
  var copyObj = {};
  for (var key in originalObj) {
    copyObj[key] = originalObj[key];
  }
  return copyObj;
};

export const castForEditing = val => {
  if (typeof val === "number" || typeof val === "string") {
    return "" + val;
  }
  return val;
};

export const zeroPadding = (num, digit) => {
  let zero = "";
  for (let i = 0; i < digit; i++) {
    zero = zero + "0";
  }
  return (zero + "" + num).slice(-1 * digit);
};

export const retryWithWait = (retryInterval, retryMax, func) => {
  return new Promise(resolve => {
    let controller = runWithInterval(
      { interal: retryInterval, maxTime: retryMax },
      resolve2 => {
        try {
          let ret = func();

          resolve(ret);
          controller.clear();
        } catch (e) {}

        resolve2();
      }
    );
  });
};

export const nullOrUndefined = v => v === null || typeof v === "undefined";

export const runWithInterval = (setting, promiseSource) => {
  let interval = 100;
  let monitorInterval = 50;
  let maxTime = 0;
  if (typeof setting === "number") {
    interval = setting;
  } else if (typeof setting === "object") {
    if (!nullOrUndefined(setting.interval)) {
      interval = setting.interval;
    }
    if (!nullOrUndefined(setting.monitorInterval)) {
      monitorInterval = setting.monitorInterval;
    }
    if (!nullOrUndefined(setting.maxTime)) {
      maxTime = setting.maxTime;
    }
  }

  let cleared = false;
  let setIntervalId = null;
  let clearFunc = () => {
    cleared = true;
    clearInterval(setIntervalId);
  };

  let onceFinishFlag = true;
  let run = () => {
    if (cleared) {
      return;
    }
    new Promise(resolve => promiseSource(resolve)).then(() => {
      onceFinishFlag = true;
    });
  };

  let count = 0;
  let monitorOnce = () => {
    if (cleared) {
      return;
    }
    if (onceFinishFlag) {
      onceFinishFlag = false;

      if (maxTime > 0) {
        count++;
        if (count > maxTime) {
          return clearFunc();
        }
      }
      setTimeout(run, interval);
    }
  };

  setIntervalId = setInterval(monitorOnce, monitorInterval);

  return { clear: clearFunc };
};

export const nTimes = (n, func) => {
  for (let i = 0; i < n; i++) {
    func(i);
  }
};

export const toggleState = (object, key) => {
  let toSet = {};
  toSet[key] = !object.state[key];
  object.setState(toSet);
};

export const createCsvBlob = rowsArray => {
  let data = rowsArray
    .map(values => values.map(val => (val.indexOf(",") < 0 ? val : `"${val}"`)))
    .join("\n");

  console.log("CSV", data);

  return new Blob([data], {
    type: window.navigator.msSaveOrOpenBlob
      ? this.getMimeType()
      : "octet/stream"
  });
};

export const downloadBlob = (fileName, blob) => {
  console.log("blob", blob);
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    // data URI pattern
    const element = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    console.log("URL", url);
    element.setAttribute("href", url);
    element.setAttribute("download", fileName);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(element);
  }
};

export const downloadAsCsv = (fileName, rowsArray) => {
  downloadBlob(fileName, createCsvBlob(rowsArray));
};
