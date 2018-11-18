import React, {Component} from "react"
import {Tag} from 'antd'

class Footer extends Component{

    render(){
        return <footer>
            <span><Tag>浙ICP备18042981号-1</Tag></span>
            <label><Tag>github: <a href="https://github.com/moiamoia/blog-pic" target='_blank'>https://github.com/moiamoia/blog-pic</a></Tag></label>
        </footer>
    }
}

export default Footer
