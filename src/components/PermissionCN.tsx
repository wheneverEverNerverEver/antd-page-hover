
import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { useModel } from 'umi';
import { includes } from 'lodash';

/**
 * account:add	新增用户
account:delete	删除用户
account:update	编辑用户

product:add	新增商品
product:delete	删除商品
product:update	编辑商品
product:import	导入商品

department:import	导入分类
department:delete	删除分类
department:showIf   是否在菜单中显示

customer:import	导入客户
customer:delete	删除客户

bill:image	上传订单图片
bill:update	确认收款
bill:import	导入订单
bill:importSmail	覆盖导入订单

role:authImport	权限文件导入
role:delete	删除角色
role:update	编辑角色
role:add	新增角色
  
 */
export type PermissionKey =
    'account:add' |
    'account:delete' |
    'account:update' |
    'product:add' |
    'product:delete' |
    'product:update' |
    'product:import' |
    'product:importyz' |
    'department:import' |
    'department:delete' |
    'customer:import' |
    'customer:delete' |
    'bill:image' |
    'bill:update' |
    'bill:import' |
    'bill:importSmail' |
    'role:authImport' |
    'role:delete' |
    'role:update' |
    'role:add' |
    'department:showIf'

export function PermissionCN(props: PropsWithChildren<{ permissionKey: PermissionKey }>) {
    const { permissionKey, children } = props
    const { initialState } = useModel('@@initialState');
    const ifHadPer = useMemo(() => includes(initialState?.currentUser?.roleCode || [], permissionKey), [initialState, permissionKey])

    if (ifHadPer) {
        return (<>{children}</>)
    }
    return (<></>);
}
