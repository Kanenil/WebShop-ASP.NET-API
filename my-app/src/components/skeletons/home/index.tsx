import { DataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";
import { Column } from "primereact/column";

const HomePageSkeleton = () => {
  const skeletonArray = Array.from({ length: 4 }).map((_, i) => ({
    id: i + 1,
    name: "",
    description: "",
    image: "",
  }));

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>
}

  return (
    <div className="cont mt-4">
      <DataTable
        value={skeletonArray}
        header={<Skeleton width="100%" height="50px" />}
        footer={<Skeleton width="100%" height="50px" />}
        tableStyle={{ minWidth: "60rem" }}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
      >
        <Column field="id" header="Id" body={<Skeleton/>} />
        <Column 
            header="Image"
          body={() => <Skeleton width="100%" height="100px" />}
        />
        <Column field="name" header="Name" body={bodyTemplate} />
        <Column field="description" header="Description" body={bodyTemplate} />
      </DataTable>
    </div>
  );
};

export default HomePageSkeleton;
