# notification

适用于：通知。

`*`表示虚拟字段

- `type` 通知类型，详见下表
- `source` 来源
- `target` 目标
- `object` object
- `response` response
- `value` value
- `hasActived` 是否已经激活了
- `activeAt` 激活时间
- `meta` 元信息


# type
- `comment`: A评论了B的object
- `reply`: A回复了B的comment
- `accept`: A的回答被接受了
- `agree`: A的评论/回复被赞同
- `role`: A的权限被修改了
- `favorite`: A收藏了B的object
- `apply`: A申请了B的organization
- `follow`: A关注了B
- `at`: A提到了B
- `score`: A的object被管理员加分了
- `color`: A的object被管理员加色了
- `essence`: A的object被管理员设置为精华
- `recommend`: A的object被管理员设置为推荐
- `update`: A的object被管理员更新了
- `certificated`: A的organization被认证了
- `weibo`: A的个人微博被认证了
