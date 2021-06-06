import { path } from '@/config/http';
import Media, { PICS_RESIZE_40 } from '@/models/media';
import { Image, Text, View } from '@tarojs/components';
import classNames from 'classnames';
import React, { FC, useMemo } from 'react';

interface ITagPrice {
  pointInfo: any;
  className?: string;
  showPrice?: boolean
}

const XTagPrice: FC<ITagPrice> = (props) => {
  const { className, pointInfo, showPrice } = props;
  const classes = classNames('tag-and-price', className);

  const str = useMemo(() => {
    if(pointInfo?.price && pointInfo?.tag && showPrice) {
      return `${pointInfo?.tag}   人均${pointInfo?.price / 100}元`
    }
    return `${pointInfo?.tag}` 
  }, [pointInfo?.price, pointInfo?.tag, showPrice])

  const logo = useMemo(() => {
    if(pointInfo?.logo) {
      const s = `${path.unclocked}/${pointInfo?.logo}`
      return Media.pointIcon(s)
    }
    return ''
  }, [pointInfo?.logo])

  return (
    <View className={classes}>
      <Image className="pic" mode="widthFix" src={logo} />
      <Text className="tag" space="nbsp">{str}</Text>
    </View>
  );
};

XTagPrice.defaultProps = {
  showPrice: true
}

export default XTagPrice;
