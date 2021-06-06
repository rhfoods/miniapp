import { EMsgType, MessageReturnTypes } from "@/context/message-ctx";

class MessageModel {

  static getMsgType(type: MessageReturnTypes) {
    if(
      type === MessageReturnTypes.CLOCK_NOTE ||
      type === MessageReturnTypes.CLOCK_POINT
    ) return EMsgType.clock

    if(
      type === MessageReturnTypes.COMMENT_COMMENT ||
      type === MessageReturnTypes.COMMENT_NOTE
    ) return EMsgType.comment

    if(
      type === MessageReturnTypes.LIKE_COMMENT ||
      type === MessageReturnTypes.LIKE_NOTE
    ) return EMsgType.like

    if(
      type === MessageReturnTypes.SAVE_MAP ||
      type === MessageReturnTypes.SAVE_NOTE ||
      type === MessageReturnTypes.SET_TOP
    ) return EMsgType.save

    if(type === MessageReturnTypes.SYSTEM) return EMsgType.system
  }
  
}

export default MessageModel