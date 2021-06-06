import { ESharetItem } from "@/component/alert/sheet"

const items = [
  { 
    type: 'share', 
    text: ESharetItem.share, 
    icon: 'weixin', 
    key: 'weixin',
    iconColor: '#3ABF11', 
  },{ 
    type: 'common', 
    text: ESharetItem.poster, 
    icon: 'pengyouquan', 
    key: 'pengyouquan', 
    colorFull: true,
    className: 'share-poster',
  }
]

function useRecommedShare() {
  return { shareList: [...items] }
}

export default useRecommedShare