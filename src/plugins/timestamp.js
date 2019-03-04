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
function timestampToTime (timestamp) {
  var date = new Date(timestamp),
    year = date.getFullYear(),
    month = date.getMonth()+1,
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    week = new Array('일', '월', '화', '수', '목', '금', '토');

  var convertDate = year + "년 "+month+"월 "+ day +"일 ("+ week[date.getDay()] +") ";
  var convertHour="";
  if(hour < 12){
    convertHour = "오전 " + addNumZero(hour) +":" + addNumZero(minute);
  }else if(hour === 12){
    convertHour = "오후 " + addNumZero(hour) +":" + addNumZero(minute);
  }else{
    convertHour = "오후 " + addNumZero(hour - 12) +":" + addNumZero(minute);
  }

  return convertDate + convertHour;
}

/**
 *  10미만 숫자 앞에 0 붙이기
 */
const addNumZero = (n) => n > 9 ? "" + n: "0" + n;


export {
  timestampToTime,
  yyyyMMddHHmmsss
}
