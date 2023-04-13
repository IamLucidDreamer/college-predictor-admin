import React, { useEffect, useReducer, useState } from "react";
import { DataTable } from "../components/table/Index";
import ActionButtons from "../components/actionsButtons/Index";
import axios from "../../appConfig/httpHelper";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DrawerComp } from "./components/Drawer";
import { FilterDrawer } from "./components/FilterDrawer";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { innerTableActionBtnDesign } from "../components/styles/innerTableActions";
import { EditProduct } from "./components/EditProduct";
import { useSelector } from "react-redux";

export const ProductMaster = () => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  const user = useSelector((state) => state.user);

  // Declaring the States Required for the Working of the Component
  const [actions, setActions] = useReducer(
    (state, diff) => ({ ...state, ...diff }),
    {
      drawer: false,
      editPlan: false,
      loading: false,
      filter: false,
      pagination: 15,
      trash: false,
      newProduct: false,
      loadingAllProducts: false,
      downloadAllProducts: false,
    }
  );

  const {
    drawer,
    editPlan,
    loading,
    filter,
    pagination,
    trash,
    newProduct,
    loadingAllProducts,
    downloadAllProducts,
  } = actions;

  const [value, setValue] = useReducer(
    (state, diff) => ({ ...state, ...diff }),
    {
      products: [],
      allProducts: [],
      drawerValue: {},
      filterValue: {},
      editValue: {},
    }
  );

  const { products, allProducts, drawerValue, filterValue, editValue } = value;

  // Functions Used for Different Data
  const requestsCaller = () => {
    setActions({ loading: true });
    axios
      .get("/product/get-all/admin?limit=50&offset=0", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setValue({ products: res.data.data });
      })
      .catch((err) => console.log(err))
      .finally(setActions({ loading: false }));
  };

  const getAllProducts = () => {
    setActions({ loadingAllProducts: true });
    axios
      .get("/product/get-all/corporate?limit=50&offset=0", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("Products Ready for Download");
        setActions({ downloadAllProducts: true });
        setValue({ allProducts: res.data.data });
      })
      .catch((err) => console.log(err))
      .finally(setActions({ loadingAllProducts: true }));
  };

  const getProductBySearch = (value) => {
    setActions({ loading: true });
    axios
      .post(
        "/product/search",
        {
          key: "title",
          value: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        toast.success("Search Performed Successfully.");
        setValue({ products: res.data.data });
      })
      .catch((err) => console.log(err))
      .finally(setActions({ loading: false }));
  };

  const getFilteredProduct = (value) => {
    setActions({ loading: true });
    const filterValue = {};
    filterValue.userId = user.id;
    if (value.packagingTypeSelected !== "") {
      filterValue.packagingType = value.packagingTypeSelected;
    }
    if (value.uomSelected !== "") {
      filterValue.uom = value.uomSelected;
    }
    console.log({ filterValue });
    axios
      .post("/product/get-all/query", filterValue, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("Filters Applied Successfully.");
        setValue({ products: res.data.data });
        console.log(res.data.data);
      })
      .catch((err) => console.log(err))
      .finally(setActions({ loading: false }));
  };

  const DeleteItem = (productId) => {
    axios
      .delete(`/product/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success(res.data.message);
        requestsCaller();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Product Deletion Failed");
      });
  };

  useEffect(() => requestsCaller(), []);

  // This Columns Variable is used to determine The Values getting inside the Table Component
  const columns = [
    {
      key: "title",
      title: "Title",
      render: (data) => data.title,
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      key: "userName",
      title: "User Name",
      render: (data) => data.user?.name,
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      key: "productCode",
      title: "Product Code",
      render: (data) => data.productCode,
    },
    {
      key: "packagingType",
      title: "Packaging Type",
      render: (data) =>
        data.packagingType.map((data) => (
          <div>
            <p>{data},</p>
          </div>
        )),
    },
    {
      key: "uom",
      title: "UOM",
      render: (data) => data.uom,
    },
    {
      key: "description",
      title: "Description",
      render: (data) => data.description,
    },
    {
      key: "points",
      title: "Points",
      render: (data) => data.points,
      sorter: (a, b) => a.points - b.points,
    },
    {
      key: "isApproved",
      title: "Status",
      render: (data) => (data.isApproved ? "Approved" : "Pending"),
    },
    {
      key: "actions",
      title: "Actions",
      render: (record) => <ColumnActions record={record} />,
    },
  ];

  const ColumnActions = (props) => {
    return (
      <div className="flex justify-around">
        <EyeOutlined
          title="View"
          style={innerTableActionBtnDesign}
          onClick={() => {
            setActions({ drawer: true });
            setValue({ drawerValue: props?.record });
          }}
        />
        <EditOutlined
          title="Edit"
          style={innerTableActionBtnDesign}
          onClick={() => {
            setActions({ editPlan: true });
            setValue({ editValue: props?.record });
            console.log(props?.record, "Hello");
          }}
        />
        {!props?.record?.isApproved ? (
          <DeleteOutlined
            title="Ban"
            style={innerTableActionBtnDesign}
            onClick={() => DeleteItem(props?.record?.productId)}
          />
        ) : null}
      </div>
    );
  };

  const backEditNewProduct = () => setActions({ editPlan: false });

  const onCloseDrawer = () => {
    setActions({ drawer: false });
    setValue({ drawerValue: {} });
  };

  const openFilterDrawer = () => {
    setActions({ filter: true });
  };

  const onCloseFilterDrawer = () => {
    setActions({ filter: false });
    setValue({ filterValue: {} });
  };

  return (
    <>
      {editPlan ? (
        <EditProduct back={backEditNewProduct} data={editValue} />
      ) : (
        <div className="">
          <ActionButtons
            pageTitle={"Products"}
            showSearchButton={true}
            onSearch={getProductBySearch}
            showFilterButton={true}
            onFilter={openFilterDrawer}
            showTrashButton={false}
            showTrashFunction={""}
            showReFreshButton={true}
            refreshFunction={requestsCaller}
            showExportDataButton={true}
            exportDataFunction={getAllProducts}
            totalItems={allProducts}
            csvName={"Products.csv"}
            loadingItems={loadingAllProducts}
            downloadItems={downloadAllProducts}
            showAddNewButton={false}
            addNewFunction={""}
          />
          <div className="border-2 mt-5">
            <DataTable
              usersData={products}
              columns={columns}
              loading={loading}
            />
          </div>
          <div>
            <DrawerComp
              title={"Product Details"}
              visible={drawer}
              onCloseDrawer={onCloseDrawer}
              data={drawerValue}
            />
          </div>
          <div>
            <FilterDrawer
              title={"Set Product Filters"}
              visible={filter}
              onCloseDrawer={onCloseFilterDrawer}
              data={filterValue}
              applyFilter={getFilteredProduct}
              resetFilter={requestsCaller}
            />
          </div>
        </div>
      )}
    </>
  );
};
