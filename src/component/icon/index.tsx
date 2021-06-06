import React, { FC, useMemo } from 'react'
import { CoverView, Text, View } from '@tarojs/components'
import classNames from 'classnames'
// import './iconfont/iconfont.css'
// import './iconfont/iconfont-weapp-icon.css'

interface IconProps {
    name: string
    color?: string
    size?: string
    colorFull?: boolean
    className?: string
    useCover?: boolean
    onClick?: (e: any) => void
}

const XIcon: FC<IconProps> = (props) => {
    const { color, size, name, className, colorFull, useCover, onClick } = props
    const nomoClasses = classNames('iconfont', 'mono-icon', className, {
        [`icon-${name}`]: name
    })
    const colorClasses = classNames('t-icon', 'color-icon', className, {
        [`t-icon-${name}`]: name
    })
    const nomostyle = useMemo(() => ({
        color,
        fontSize: `${size}px`
    }), [color, size])
    const colorStyle = useMemo(() => ({
        width: `${size}px`,
        height: `${size}px`,
    }), [color, size])

    function tag(e) {
        onClick && onClick(e)
    }

    if(colorFull) {
        return <Text className={colorClasses} style={colorStyle} >
            {
                useCover
                ?
                <CoverView className='icon-btn icon-cover' onClick={tag} ></CoverView>
                :
                <View className='icon-btn' onClick={tag} ></View>
            }
        </Text>
    }
    return <View className={nomoClasses} style={nomostyle} >
        {
            useCover
            ?
            <CoverView className='icon-btn icon-cover' onClick={tag} ></CoverView>
            :
            <View className='icon-btn' onClick={tag} ></View>
        }
    </View>
}

XIcon.defaultProps = {
    name: 'daijinquan',
    color: 'cornflowerblue',
    size: '24',
    colorFull: false
}

export default XIcon