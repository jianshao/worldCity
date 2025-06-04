import React from "react";
import InviteRecommendTab from "./InviteRecommendTab";

// 此处我们假设“全部”服务内容和推荐一致，后续可替换数据源
const InviteAllTab = ({ uid }: any) => {
  return <InviteRecommendTab uid={uid} />;
};

export default InviteAllTab;
