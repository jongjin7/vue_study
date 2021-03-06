export default{
  PUSH_MSG_DATA :'pushMsgData',
  STORAGE_KEY_MEMBER_INFO : 'memberInfo',



  FETCH_DATA:'fetchData',
  ADD_TODO:'addTodo',
  DONE_TOGGLE:'doneToggle',
  DELETE_TODO:'deleteTodo',
  REVERSE_TEXT:'reverseText',

  DONE_ITEMS :'doneItems',
  ACTIVE_ITEMS:'activeItems',
}

export const USER_DATA ={
  REAR_FIREDB_NAME:'fireWebChat',
  INDEXDB_DB_NAME:"USER",
  INDEXDB_VERSION:1,
  INDEXDB_STORE:'Users',
  CURRENT_USER:'currentUser',
}

export const CHAT_ROOM ={
  STORAGE_KEY_OPEN_ROOM : 'OPEN_CHAT_ROOM',
  STORAGE_KEY_CHAT_USER_LIST: 'chatUserList',
  STORAGE_KEY_CHAT_ROOM_LIST: 'chatRoomList',

  TYPE_MULTI : 'MULTI',
  TYPE_ONE_VS_ONE: 'ONE_VS_ONE',
  SPLIT_CHAR:'@spl@'
}

export const filterType = {
  ALL: "All",
  DONE: "Done",
  ACTIVE: "Active"
};
