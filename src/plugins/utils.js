const deCompileHtmlTag = (str) => {
  str = str.replace(/&lt;/g,"<");
  str = str.replace(/&gt;/g,">");
  str = str.replace(/&quot;/g,"\"");
  str = str.replace(/&#39;/g,"\\'");
  str = str.replace(/<br\/>/g,"\n");

  return str;
}

const reExpHtmlTag = (data) => {
  const regExp = /<(\/)?([a-zA-Z1-6]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig; //HTML태그 정규식

  if(regExp.test(data)){
    //console.log('정규식 사용')
    let tmp = data.replace(regExp, '').trim();
    return { is:true, val:tmp };
  }else{
    //console.log('정규식 사용 안함')
    return{ is:false };
  }
}

export const Utils = {
  DECOMPILE_HTMLTAG : deCompileHtmlTag,
  hasHtmlTag : reExpHtmlTag,
}
