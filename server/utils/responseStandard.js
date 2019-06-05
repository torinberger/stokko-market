
module.exports = function (type, data) {

  if(type == 'err') { var status = 400 }
  else if(type == 'success') { var status = 200 }
  else { var status = 400; type = 'err' }

  return {
    type,
    status,
    data
  }
};
