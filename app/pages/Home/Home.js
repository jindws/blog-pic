import React,{Component} from "react"
import List from '../../Component/List'
import {Icon} from 'antd'

class Home extends Component {
    render() {
        return [
            <header key='header' className='header'>
                <div className='animated bounce' onClick={()=>{
                    $("html,body").finish().animate({"scrollTop":$('header').height},900);
                }}>
                    <Icon type="down" />
                </div>
            </header>,
            <List/>
        ]
    }
}

export default Home
