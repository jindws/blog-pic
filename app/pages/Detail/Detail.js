import React,{Component} from "react"
import {Link} from 'react-router-dom'
import DB from '../../DB'
import moment from 'moment'
import Header from '../../Component/Header'
import {Tag,Button,message} from 'antd'

import {observable,action} from 'mobx';
import { observer,inject } from "mobx-react/custom"

const _data = observable({
})

const _onload = action((data)=>Object.assign(_data,data))

@inject('store')
@observer
class Detail extends Component {

    constructor(props){
        super(props)
        this.id = props.match.params.id
        this.props.store._change('title','')
    }

    componentDidMount(){
        const {id} = this
        DB.Article.Detail({
            id,
        }).then((data)=>{
            _onload(data)
            this.props.store._change('title',data.title)
            setTimeout(()=>{
                var mySwiper = new Swiper('.swiper-container', {
                	autoplay: true,//可选选项，自动滑动
                    effect : 'coverflow',
                    slidesPerView: 3,
                    centeredSlides: true,
                })
            },0)
        },({errorMsg})=>{
            message.error(errorMsg)
            setTimeout(()=>{
                location.replace('/')
            },2000)
        })
    }

    render() {
        const {title,list='',create_time,type = '',author} = _data
        const {id} = this
        return [
            <Header key='header'/>,
            <section key='detail' id='detail' className='ql-snow contain'>
                <header>{title}</header>
                {
                    type&&type.split(',').map(it=><Tag onClick={()=>location.href = `/type/${it}`}>{it}</Tag>)
                }
                <time>{create_time&&moment(create_time).format('YYYY-MM-DD HH:mm:ss')}</time>
                <div className="swiper-container">
                  <div className="swiper-wrapper">
                    {
                        list&&list.split(',').map(itm=>{
                            return <div className="swiper-slide">
                                <img src={itm} alt=""/>
                            </div>
                        })
                    }
                  </div>
                </div>
                <a href={`/operate/${id}`}
                style={{display:(author?'':'none')}}
                ><Button shape="circle" icon="edit" /></a>
            </section>,

        ]
    }
}

export default Detail
