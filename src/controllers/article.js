const {
    getResponse
} = require('../helpers')

const Create = async ctx=>{
    let {body} = ctx.request
    let {
        title,
        list=[],
        type=[]
    } = body
    if(!title){
        ctx.body = getResponse(false,'e001')
        return
    }

    type = [...new Set(type.map(it=>it.trim()))]
    const {admin} = ctx.state
    const n_article = await modal.Article.create([
        title,
        list.join(),
        type.join(),
        admin.id,
    ])
    ctx.body = getResponse(true,'操作成功')

    CType(type,n_article.insertId)
}

const CType = async (type,article_id)=>{
    await modal.ArticleType.remove([+article_id])
    for (let it of type) {
        await modal.Type.create([it])
        await modal.ArticleType.create([+article_id,it])
    }
}

const Detail = async ctx=>{
    const {
        id
    } = ctx.params
    if(!id){
        ctx.body = getResponse(false,'e001')
        return
    }
    let detail = await modal.Article.detail([id])
    if(!detail[0]){
        ctx.body = getResponse(false,'e002')
        return
    }

    detail = detail[0]

    const {admin={}} = ctx.state

    const {create_user_id} = detail

    const author = detail.create_user_id&&detail.create_user_id === admin.id

    ctx.body = getResponse(true,{
        ...detail,
        author,
    })
}

const List = async ctx=>{
    let {body} = ctx.request
    const {
        pageSize=10,
        pageNum=1,
        type,
        search,
    } = body
    let list,count
    if(type){
        list = await modal.Article.searchlist([type,(+pageNum-1)*+pageSize,pageSize])
        count = await modal.Article.searchcount([type])
    }else if(search){
        list = await modal.Article.searchtitlelist([`%${search}%`,(+pageNum-1)*+pageSize,pageSize])
        count = await modal.Article.searchtitlecount([`%${search}%`])
    }else{
        list = await modal.Article.list([(+pageNum-1)*+pageSize,pageSize])
        count = await modal.Article.count()
    }

    ctx.body = getResponse(true,{
        list,
        count:count[0]['count(*)'],
    })
}

const Update = async ctx=>{
    let {body} = ctx.request
    let {
        id,
        title,
        list=[],
        type=[],
    } = body
    if(!title||!id){
        ctx.body = getResponse(false,'e001')
        return
    }

    type = [...new Set(type.map(it=>it.trim()))]
    await modal.Article.update([title,list.join(','),type.join(','),+id])
    ctx.body = getResponse(true,'操作成功')
    CType(type,id)
}

const Remove = async ctx=>{
    let {body} = ctx.request
    let {
        id,
    } = body
    if(!id){
        ctx.body = getResponse(false,'e001')
        return
    }

    await modal.Article.remove([+id])
    ctx.body = getResponse(true,'操作成功')
    await modal.ArticleType.remove([+id])
}

const MyList = async ctx=>{
    let {body} = ctx.request
    const {id} = ctx.state.admin
    const {
        pageSize=10,
        pageNum=1,
    } = body
    const list = await modal.Article.mylist([id,(+pageNum-1)*+pageSize,pageSize])
    const count = await modal.Article.mycount([id])

    ctx.body = getResponse(true,{
        list,
        count:count[0]['count(*)'],
    })
}

module.exports = {
    Create,
    Detail,
    List,
    Update,
    Remove,
    MyList,
}
