// timeStamp pluginss
/**
 * 현재날짜 yyyyMMddHHmmsss형태로 반환
 */
function yyyyMMddHHmmsss(){
  var vDate = new Date();
  var yyyy = vDate.getFullYear().toString();
  var MM = (vDate.getMonth() + 1).toString();
  var dd = vDate.getDate().toString();
  var HH = vDate.getHours().toString();
  var mm = vDate.getMinutes().toString();

  var ss = vDate.getSeconds().toString();
  var sss= vDate.getMilliseconds().toString();
  return yyyy + (MM[1] ? MM : '0'+MM[0]) + (dd[1] ? dd : '0'+dd[0]) + (HH[1] ? HH : '0'+ HH[0])
    + (mm[1] ? mm : '0'+ mm[0]) + (ss[1] ? ss : '0'+ss[0])+ sss;
};

/**
 * timestamp를 날짜 시간 으로 변환
 */
function timestampToTime (timestamp, outputCondition) {
  var date = new Date(timestamp),
    year = date.getFullYear(),
    month = date.getMonth()+1,
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    week = new Array('일', '월', '화', '수', '목', '금', '토');
  let outputTimeStamp;

  var convertDate = year + "년 "+month+"월 "+ day +"일 ("+ week[date.getDay()] +") ";
  var convertHour="";
  if(hour < 12){
    convertHour = "오전 " + (hour == 0? 12: hour) +":" + addNumZero(minute);
  }else if(hour === 12){
    convertHour = "오후 " + hour +":" + addNumZero(minute);
  }else{
    convertHour = "오후 " + (hour - 12) +":" + addNumZero(minute);
  }

  switch (outputCondition){
    case 'YMD':
      outputTimeStamp = convertDate;
      break;
    case 'YMDH':
      outputTimeStamp = convertDate + ( hour < 12 ? '오전' : '오후') + hour;
      break;
    case 'Hm':
      outputTimeStamp = convertHour;
      break;
    default:
      console.log(convertDate + convertHour);
      outputTimeStamp = convertDate + convertHour;
  }

  return outputTimeStamp;
}

function getDayTime(timestamp, dayCount){
  var date = new Date(timestamp),
    year = date.getFullYear(),
    month = date.getMonth()+1,
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds().toString(),
    mss = date.getMilliseconds().toString();
  return {
    month:month,
    day:day,
    hour: hour,
    second : second,
    milsecond: mss
  };
}



/**
 *  10미만 숫자 앞에 0 붙이기
 */
const addNumZero = (n) => n > 9 ? "" + n: "0" + n;

function timeForRoomList(timestamp) {

  var date = new Date(timestamp),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes();

  var nowDate = new Date(),
    nowYear = nowDate.getFullYear(),
    nowMonth = nowDate.getMonth() + 1,
    nowDay = nowDate.getDate(),
    nowHour = nowDate.getHours(),
    nowMinute = nowDate.getMinutes();
  var result;

  if (year === nowYear && month === nowMonth && day === nowDay) {
    result = addNumZero(hour) + ":" + addNumZero(minute);
  } else {
    result = addNumZero(year) + "-" + addNumZero(month) + "-" + addNumZero(day);
  }

  return result;
}

export {
  timestampToTime,
  yyyyMMddHHmmsss,
  timeForRoomList,
  getDayTime,
}

export const Timestamp = {
  timestampToTime,
  yyyyMMddHHmmsss,
  timeForRoomList,
  getDayTime,
}

