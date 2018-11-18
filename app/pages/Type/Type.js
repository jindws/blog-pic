import React,{Component} from "react"
import Header from '../../Component/Header'
import List from '../../Component/List'

import { observer ,inject} from "mobx-react/custom"


@inject('store')
@observer class Type extends Component {
    constructor(props){
        super(props)
        this.props.store._change('title',decodeURI(props.match.params.type))
    }

    render() {

        return [
            <Header/>,
            <List marginTop='8rem' type={this.props.store.title}/>,
        ]
    }
}

export default Type
