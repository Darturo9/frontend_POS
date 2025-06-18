type Params = Promise<{ categoryId: string }>


export default async function StorePage({ params }: { params: Params }) {

    const { categoryId } = await params

    return (
        <div>
            StorePage
        </div>
    );
}
