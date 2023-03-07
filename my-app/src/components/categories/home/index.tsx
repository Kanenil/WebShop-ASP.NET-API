import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import select from "../../../assets/select.jpg";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { FilterMatchMode } from "primereact/api";
import "./index.css";
import { InputText } from "primereact/inputtext";
import HomePageSkeleton from "./skeleton";

interface ICategoryItem {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface IFilter extends DataTableFilterMeta {
  global: {
    value: string | null;
    matchMode: FilterMatchMode;
  };
}

const CategoriesPage = () => {
  const [products, setProducts] = useState<Array<ICategoryItem>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  let state = 0;

  const navigator = useNavigate();

  const load = () => {
    setLoading(true);

    const token = localStorage.getItem("token");
    if(token)
    {
      axios
      .get<Array<ICategoryItem>>("http://localhost:5000/api/categories", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
      .then((resp) => {
        setProducts(resp.data);
        setLoading(false);
      })
      .catch((err) => {
        setTimeout(() => {
          load();
        }, 5000);
      });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const imageBodyTemplate = (product: ICategoryItem) => {
    return (
      <Image
        src={
          product.image
            ? "http://localhost:5000/images/" + product.image
            : select
        }
        alt={product.image}
        width="100"
        preview
      />
    );
  };

  const editDeleteBodyTemplate = (product: ICategoryItem) => {
    return (
      <>
        <Button
          onClick={() => {
            navigator("/categories/edit/" + product.id);
          }}
          label="Edit"
          severity="warning"
          raised
        />
        <Button
          onClick={() => {
            state = product.id;
            confirmDelete();
          }}
          className="ml-1"
          label="Delete"
          severity="danger"
          raised
        />
      </>
    );
  };

  const toast = useRef<Toast>(null);

  const accept = () => {
    axios
      .delete("http://localhost:5000/api/categories/" + state)
      .then((response) => {
        load();
        toast.current?.show({
          severity: "info",
          summary: "Success",
          detail: "Row successfuly deleted",
          life: 3000,
        });
      });
  };

  const confirmDelete = () => {
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept,
    });
  };

  const [filters, setFilters] = useState<IFilter>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const header = (
    <>
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">Categories</span>
        <Button onClick={() => load()} icon="pi pi-refresh" rounded raised />
      </div>
      <div className="flex justify-content-end mt-3">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
          />
        </span>
      </div>
    </>
  );
  const footer = `In total there are ${
    products ? products.length : 0
  } categories.`;

  return (
    <>
      {loading ? (
        <HomePageSkeleton />
      ) : (
        <div className="cont mt-4">
          <Toast ref={toast} />
          <ConfirmDialog />
          <DataTable
            value={products}
            header={header}
            footer={footer}
            filters={filters}
            filterDisplay="row"
            globalFilterFields={["name", "description", "id"]}
            tableStyle={{ minWidth: "60rem" }}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
          >
            <Column field="id" sortable header="Id"></Column>
            <Column header="Image" body={imageBodyTemplate}></Column>
            <Column field="name" sortable header="Name"></Column>
            <Column field="description" sortable header="Description"></Column>
            <Column body={editDeleteBodyTemplate}></Column>
          </DataTable>
        </div>
      )}
    </>
  );
};

export default CategoriesPage;
