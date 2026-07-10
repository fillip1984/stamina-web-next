import CollectionCard from "@/components/collection/collection-card"
import NewCollection from "@/components/collection/new-collection"

export default function Page() {
  return (
    <div className="flex grow overflow-x-auto p-4">
      <div className="container mx-auto flex w-full lg:w-1/2">
        <div className="mt-4 flex w-full gap-4">
          <CollectionCard />
          <NewCollection />
        </div>
      </div>
    </div>
  )
}
