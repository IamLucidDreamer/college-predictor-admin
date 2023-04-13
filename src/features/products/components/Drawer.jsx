import React from "react";
import { Row, Col, Drawer, Tabs, TabPane, Image } from "antd";
import { Desc } from "../../components/layout/Desc";

export const DrawerComp = (props) => {
  const { TabPane } = Tabs;
  console.log({ props });
  return (
    <Drawer
      title={props.title}
      width="75%"
      placement="right"
      onClose={() => props.onCloseDrawer()}
      visible={props.visible}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Product information" key="1">
          <Row>
            <Col span={12} lg={12} md={12} sm={32} xs={32}>
              <Desc title="Name" content={props?.data?.title} />
              <div className="site-description-item-profile-wrapper">
                <p className="site-description-item-profile-p-label text-purple-1 flex m-0">
                  <b>Packing Type : </b>
                  <div className="flex">
                    {props?.data?.packagingType?.map(data => <p>{data}, </p>)  }
                  </div>
                </p>
              </div>
              
              <Desc title="Industry Type" content={props?.data?.industryType} />
              <Desc
                title="Approval Status"
                content={props?.data?.isApproved ? "Approved" : "Not Approved"}
              />
            </Col>
            <Col span={12} lg={12} md={12} sm={32} xs={32}>
              <Desc title="Registered On" content={props?.data?.createdAt} />
              <Desc title="UOM" content={props?.data?.uom} />
              <Desc title="Description" content={props?.data?.description} />
              <Desc title="Points" content={props?.data?.points} />
            </Col>

            <Col span={32} className="p-3 mt-3">
              <h2>
                <b>Image : </b>
              </h2>
              <Image src={props?.data?.photo} width={"300px"} />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Drawer>
  );
};
