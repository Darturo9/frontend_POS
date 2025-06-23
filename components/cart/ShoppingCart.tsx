"use client"
import { useStore } from "@/src/store"
import ShoppingCartItem from "./ShoppingCartItem"
import Amount from "./Amount"

export default function ShopingCart() {

  const contents = useStore(state => state.contents)
  const total = useStore(state => state.total)

  return (
    <>

      {contents.length ? (
        <>
          <h2 className='text-4xl font-bold text-gray-900'>Resumen de venta</h2>
          <ul role="list" className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500">

            {contents.map(item => (
              <ShoppingCartItem

                key={item.productId}
                item={item}
              />
            ))}

          </ul>
          <dl className="space-y-6 border-t border-gray-300 py-6 text-sm font-medium text-gray-500">
            <Amount

              label="Total a pagar"
              amount={total}

            />
          </dl>
        </>
      ) : (
        <p className="text-xl text-center text-gray-900">El carrito esta vacio.</p>
      )}
    </>
  )
}
