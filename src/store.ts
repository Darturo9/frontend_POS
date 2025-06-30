import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Coupon, CouponResponseSchema, Product, ShoppingCart } from "./schemas";


interface Store {
    total: number
    contents: ShoppingCart
    coupon: Coupon
    addToCart: (product: Product) => void
    updateQuantity: (id: Product['id'], quantity: number) => void
    removeFromCart: (id: Product['id']) => void
    calculateTotal: () => void
    applyCoupon: (couponName: string) => Promise<void>
}

export const useStore = create<Store>()(devtools((set, get) => ({
    total: 0,
    contents: [],
    coupon: {
        percetage: 0,
        name: '',
        message: ''
    },
    addToCart: (product) => {

        const { id: productId, categoryId, ...data } = product
        let contents: ShoppingCart = []
        const duplicated = get().contents.findIndex(item => item.productId === productId)

        if (duplicated >= 0) {
            if (get().contents[duplicated].quantity >= get().contents[duplicated].inventory) return
            contents = get().contents.map(item => item.productId === productId ? {
                ...item,
                quantity: item.quantity + 1
            } : item)

        } else {
            contents = [...get().contents, {
                ...data,
                quantity: 1,
                productId
            }]
        }

        set(() => ({
            contents
        }))

        get().calculateTotal()

    },
    updateQuantity: (id, quantity) => {
        const contents = get().contents.map(item => item.productId === id ? { ...item, quantity } : item)
        set(() => ({
            contents
        }))
        get().calculateTotal()
    },
    removeFromCart: (id) => {
        set((state) => ({
            contents: state.contents.filter(item => item.productId !== id)
        }))
        get().calculateTotal()
    },
    calculateTotal: () => {
        const total = get().contents.reduce((total, item) => total + (item.quantity * item.price), 0)
        set(() => ({
            total
        }))
    },
    applyCoupon: async (couponName) => {
        const req = await fetch('/coupons/api', {
            method: 'POST',
            body: JSON.stringify({
                coupon_name: couponName
            })
        })
        const json = await req.json()
        const coupon = CouponResponseSchema.parse(json)
        set(() => ({
            coupon
        }))
    }
})))