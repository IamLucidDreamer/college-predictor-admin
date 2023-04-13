import React, { useState, useReducer } from "react";
import { Row, Col, Drawer, Tabs, TabPane, Image, Button } from "antd";
import { Desc } from "../../components/layout/Desc";
import { useSelector } from "react-redux";

export const FilterDrawer = (props) => {
  const [value, setValue] = useReducer(
    (state, diff) => ({ ...state, ...diff }),
    {
      packagingTypeSelected: {},
      uomSelected: {},
    }
  );

  const uom = useSelector((state) => state.statics.uom);
  const packagingType = useSelector((state) => state.statics.packagingType);

  const resetFilters = () => {
    setValue({ packagingType: {}, uomSelected: {} });
    props.resetFilter();
  };

  const { TabPane } = Tabs;
  console.log({ props });
  return (
    <Drawer
      title={props.title}
      width="500px"
      placement="right"
      onClose={() => props.onCloseDrawer()}
      visible={props.visible}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Filters" key="1" style={{ padding: 10 }}>
          <h1 className="text-xl font-bold mt-4">Packaging Type</h1>
          <div className="flex flex-wrap gap-4">
            {packagingType.map((data) => (
              <Button
                type="primary"
                onClick={() => {setValue({ packagingType : {...packagingType ,  "packagingType": data.name} }) ; console.log(value) }}
              >
                {data.name}
              </Button>
            ))}
          </div>
          <h1 className="text-xl font-bold mt-4">Unit of Measurement</h1>
          <div className="flex flex-wrap gap-4">
            {uom.map((data) => (
              <Button
                type="primary"
                onClick={() => setValue({uomSelected : data.name})}
              >
                {data.name}
              </Button>
            ))}
          </div>
          <div className="absolute bottom-5 bg-white flex justify-between items-center w-10/12">
            <div className="w-1/2">
              <Button type="default" onClick={() => resetFilters()}>
                Reset
              </Button>
            </div>
            <div className="w-1/2">
              <Button
                type="primary"
                onClick={() =>
                  props.applyFilter({
                    value
                  })
                }
              >
                Apply
              </Button>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Drawer>
  );
};
