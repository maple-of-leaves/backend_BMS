import { login, userList, users, rightslist, roles, categories, goods, orders, kuaidi, status, upload } from './http'

import request from './service'
// 登录接口
export function Login(data) {

    return request({
        url: login,
        method: "post",
        data,
        // hideloading: false
    })
}
// 左侧菜单数据
export function menu(params) {
    return request({
        url: userList,
        method: "get",
        params,
        // hideloading: false
    })
}
// 获取用户列表信息
export function usersMsg(params) {
    return request({
        url: users,
        method: "get",
        params,
        // hideloading: false
    })
}

// 添加用户
export function AddUsers(data) {
    return request({
        url: users,
        method: "post",
        data,
    })
}

// 改变用户状态

export function ChangeStatus(url) {

    return request({

        url: "/users/" + (url.id) + "/state/" + url.mg_state,

        method: "put",

    })
}


// 根据id查询用户信息

export function finduser(id) {
    return request({
        url: users + '/' + id,
        method: "get"
    })
}

// 编辑用户
// edituser + info.id + ','  + info.email +',' + info.mobile
export function EditUser(data) {
    return request({
        url: '/users/' + data.id,
        method: "put",
        data
    })
}

// 删除用户

export function Delete(id) {

    return request({
        url: users + '/' + id,
        method: "delete",

    })

}

// 用户权限列表
export function rights() {
    return request({
        url: rightslist,
        method: "get"
    })
}
// 获取权限列表
export function Roles() {
    return request({
        url: roles,
        method: "get"
    })
}

// 添加角色
export function AddRoles(data) {
    return request({
        url: roles,
        method: "post",
        data
    })
}

// 查找角色
export function FindRole(id) {
    return request({
        url: roles + '/' + id,
        method: "get",

    })
}
// 编辑角色
export function EditRole(data) {
    return request({
        url: roles + '/' + data.id,
        method: "put",
        data
    })
}

// 删除角色
export function DeleteRole(id) {
    return request({
        url: roles + '/' + id,
        method: "delete",

    })
}
// 获取权限列表  树形
export function GetRoleRight() {
    return request({
        url: "/rights/tree",
        method: "get",

    })
}


// 获取修改后的角色权限
export function GetEditRoleRights(data) {
    return request({
        url: "/roles/" + data.roleid + "/rights",
        method: "post",
        data
    })
}

// 删除角色制定权限
export function DeleteRoleRights(roleid, rightid) {
    return request({
        url: "/roles/" + roleid + "/rights/" + rightid,
        method: "delete",

    })
}



// 商品分类列表
export function Categories(params) {
    return request({
        url: categories,
        method: "get",
        params
    })
}
// 获取分类参数列表
export function GetCateList(params) {
    return request({
        url: categories + '/' + params.id + '/' + "attributes",
        method: "get",
        params: {
            sel: params.activeName
        }
    })
}

// 添加参数火属性
export function AddCateList(data) {
    return request({
        url: categories + '/' + data.id + '/' + "attributes",
        method: "post",
        data
    })
}


// 删除参数
export function Deleteparams(params) {
    return request({
        url: categories + '/' + params.id + '/' + "attributes/" + params.attrId,
        method: "delete",

    })
}
// 查询参数或属性
export function Findparams(params) {
    return request({
        url: categories + '/' + params.id + '/' + "attributes/" + params.attrId,
        method: "get",
        params
    })
}
// 编辑参数或属性
export function Editparams(data) {
    return request({
        url: categories + '/' + data.id + '/' + "attributes/" + data.attrId,
        method: "put",
        data
    })
}


// 添加商品分类
export function AddgoodsParams(data) {
    return request({
        url: categories,
        method: "post",
        data
    })
}


// 查询商品参数

export function CheckgoodsParams(id) {
    return request({
        url: categories + '/' + id,
        method: "get",

    })
}


// 修改尚品参数
export function Editgoodsparams(data) {
    return request({
        url: categories + '/' + data.cat_id,
        method: "put",
        data
    })
}


// 删除商品分类
export function Deletegoodsparams(id) {
    return request({
        url: categories + '/' + id,
        method: "delete",

    })
}

// 获取商品列表
export function getGoods(params) {
    return request({
        url: goods,
        method: "get",
        params
    })
}
// 添加商品列表
export function AddGoods(data) {
    return request({
        url: goods,
        method: "post",
        data
    })
}
// 删除商品
export function Deletegoods(id) {
    return request({
        url: goods + '/' + id,
        method: "delete",

    })
}



// 图片上床
export function uploadPicture(data) {
    return request({
        url: upload,
        method: "post",
        data
    })
}

// 获取订单列表
export function GetOrderlist(params) {
    return request({
        url: orders,
        method: "get",
        params
    })
}
// 查看物流信息
export function checkStream(id) {
    return request({
        url: kuaidi + id,
        method: "get",

    })
}
// 数据统计
export function Statistics() {
    return request({
        url: status,
        method: "get",

    })
}