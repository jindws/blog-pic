import React,{Component} from "react"
import {render} from 'react-dom'
import ReactQuill from 'react-quill'
import Header from '../../Component/Header'
import Footer from '../../Component/Footer'
import DB from '../../DB'
import { Select,message,Input,Spin,Modal,Button,Upload,Icon} from 'antd'

const {Option} = Select
const {confirm} = Modal;

import {observable,action,toJS} from 'mobx';
import { observer,inject,Provider} from "mobx-react/custom"

const _data = observable({
    children:[],
    type:[],
    loading:!!defaultid,
    previewVisible: false,
    previewImage: '',
    fileList: [],
})

const _change = action((name,value)=>_data[name] = value)

const _onload = action((data)=>Object.assign(_data,data))


@observer
class Operate extends Component {

    constructor(props) {
        super(props)
        const children = [];

        for (let itm of typelist&&typelist.split(',')) {
            children.push(<Option key={itm}>{itm}</Option>);
        }

        _change('children',children)
    }

    _upload = (e) =>{
        const {fileList} = _data
        const t = this;
        const file = e.file
        const fileName = file.name
        let body = new FormData()
        body.append('files',file)
        fetch('/api/uploadfile',{
            method: "POST",
            body,
        }).then(data=>data.json()).then(({data})=>{
            fileList.push({
              uid: Date.now(),
              status: 'done',
              url: '/'+data.src,
          })
            _change('fileList',fileList)
        })
    }

    handleCancel(){
        _change('previewVisible',false)
    }

    handlePreview(file){
        _change('previewVisible',true)
        _change('previewImage',file.url || file.thumbUrl,)
    }

    handleChange(e){
        const {
            fileList,
        } = _data
        const {status,uid} = e.file
        let _fileList = toJS(fileList)
        if(status === 'removed'){
            _fileList = _fileList.filter(itm=>{
                return itm.uid !== uid
            })
            _change('fileList',_fileList)
        }
    }

    _operate(){
        const {title,fileList,type} = _data
        if(!title){
            message.error('请输入标题')
            return
        }
        const list = toJS(fileList).map(itm=>itm.url)
        if(defaultid){
            DB.Article.Update({
                id:defaultid,
                title,
                list,
                type,
            }).then(data=>{
                message.success('修改成功');
            },({errorMsg})=>{
                message.error(errorMsg);
            })
            return
        }

        DB.Article.Create({
            title,
            list,
            type,
        }).then(data=>{
            message.success('操作成功');
            location.replace('/')
        },({errorMsg})=>{
            message.error(errorMsg);
        })
    }

    _remove(){
        confirm({
            title: '温馨提示',
            content: '确认删除?',
            okText:'删除',
            cancelText:'取消',
            onOk() {
                DB.Article.Remove({
                    id:defaultid,
                }).then(data=>{
                    message.success('操作成功');
                    setTimeout(()=>location.replace('/'),2000)
                },({errorMsg})=>{
                    message.error(errorMsg);
                })
            },
        });
    }

    componentDidMount(){
        if(defaultid){
            DB.Article.Detail({
                id:defaultid
            }).then(({type,list,...data})=>{
                if(type){
                    _change('type',type.split(','))
                }
                const fileList = list.split(',').map(url=>{
                    return {
                        uid: url,
                        // name: 'xxx.png',
                        status: 'done',
                        url,
                    }
                })
                _change('fileList',fileList)

                _onload(data)
                _change('loading',false)
            },({errorMsg})=>{
                message.error(errorMsg)
                setTimeout(()=>{
                    location.replace('/')
                },2000)
            })
        }
    }

    render() {
        const {
            title,
            children,
            type = [],
            loading,
            fileList,
            previewVisible,
            previewImage
        } = _data
        fileList.length
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        );

        return [
            <Provider store={{
                title:'文章编辑',
            }}>
                <Header key='header'/>
            </Provider>,

            <Spin spinning = {loading} key='spin'>
                <section id="operate" className='contain'>
                    <div className='title'>
                        <label>标题</label>
                            <Input
                                placeholder='请输入标题'
                                value={title}
                                onChange={({target}) => {
                                    _change('title',target.value)
                                }}
                            />
                    </div>
                    <div id="operate">
                        <Upload
                          customRequest = {this._upload}
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={this.handlePreview}
                          onChange={this.handleChange}
                        >
                          {uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                          <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </div>
                    <Select
                        mode="tags"
                        style={{ width: '30%',marginRight:'10%' }}
                        placeholder="添加分类"
                        value={type}
                        onChange={type=>{
                            _change('type',type)
                        }}
                      >
                        {children}
                    </Select>
                    <Button
                        type="primary"
                        onClick={this._operate}>发布</Button>
                    <Button
                        type="danger"
                        style={{display:(defaultid?'':'none')}}
                        className='remove'
                        onClick={this._remove}>删除</Button>
                </section>
            </Spin>,
            <Footer/>
        ]
    }
}

render(<Operate/>, document.getElementById('root'))
