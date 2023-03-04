import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import select from "../../assets/select.jpg";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import "../home/index.css";

interface ICategoryItem {
  id: number;
  name: string;
  description: string;
  image: string;
}

const HomePage = () => {
  const [products, setProducts] = useState<Array<ICategoryItem>>([]);
  let state = 0;

  const navigator = useNavigate();

  const load = () => {
    axios
      .get<Array<ICategoryItem>>("http://localhost:5000/api/categories")
      .then((resp) => {
        setProducts(resp.data);
      });
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
          rounded
          raised
        />
        <Button
          onClick={() => {
            state = product.id;
            confirmDelete();
          }}
          className="ms-1"
          label="Delete"
          severity="danger"
          rounded
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

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Categories</span>
      <Button onClick={() => load()} icon="pi pi-refresh" rounded raised />
    </div>
  );
  const footer = `In total there are ${
    products ? products.length : 0
  } categories.`;

  return (
    <div className="cont mt-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      <DataTable
        value={products}
        header={header}
        footer={footer}
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
  );
};

export default HomePage;
