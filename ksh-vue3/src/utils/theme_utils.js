const theme = {
    chalk: {
        //背景颜色
        backgroundColor: '#161522',
        //标题文字颜色
        titleColor: '#ffffff',
        //主题按钮的图片
        themeSrc:'qiehuan_dark.png',
        //页面边框图片
        headerBorderSrc:'header_border_dark.png'
    },
    vintage: {
        //背景颜色
        backgroundColor: '#eeeeee',
        //标题文字颜色
        titleColor: '#000000',
        //主题按钮的图片
        themeSrc:'qiehuan_light.png',
        //页面边框图片
        headerBorderSrc:'header_border_light.png'
    }
}

export function getThemeValue(themeName){
    return theme[themeName]
}