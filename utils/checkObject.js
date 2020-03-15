// need to check that obj contains these properties: id, title, text
function checkObject(obj) {
  let titleCheck = "title" in obj;
  let textCheck = "text" in obj;

  if (Object.keys(obj).length !== 2) {
    return false;
  }

  if (titleCheck && textCheck) {
    return true;
  } else {
    return false;
  }
}

module.exports = checkObject;