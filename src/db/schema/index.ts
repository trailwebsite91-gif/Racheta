// ── Barrel Export for SmartPrint Studio Schema ───────────────────────────────

export {
  userRoleEnum,
  sellerStatusEnum,
  addressTypeEnum,
  notificationTypeEnum,
  users,
  profiles,
  sellers,
  addresses,
  wishlists,
  notifications,
} from "./users";
export type {
  User,
  NewUser,
  Profile,
  NewProfile,
  Seller,
  NewSeller,
  Address,
  NewAddress,
  Wishlist,
  NewWishlist,
  Notification,
  NewNotification,
} from "./users";

export {
  productStatusEnum,
  productImageTypeEnum,
  couponTypeEnum,
  productCategories,
  products,
  productVariants,
  productImages,
  designs,
  reviews,
  coupons,
} from "./products";
export type {
  ProductCategory,
  NewProductCategory,
  Product,
  NewProduct,
  ProductVariant,
  NewProductVariant,
  ProductImage,
  NewProductImage,
  Design,
  NewDesign,
  Review,
  NewReview,
  Coupon,
  NewCoupon,
} from "./products";

export {
  supplierRegionEnum,
  supplierStatusEnum,
  supplierConnectionStatusEnum,
  suppliers,
  supplierProducts,
  supplierConnections,
} from "./suppliers";
export type {
  Supplier,
  NewSupplier,
  SupplierProduct,
  NewSupplierProduct,
  SupplierConnection,
  NewSupplierConnection,
} from "./suppliers";

export {
  marketplaceSourceEnum,
  orderStatusEnum,
  transactionTypeEnum,
  transactionGatewayEnum,
  orders,
  orderItems,
  transactions,
} from "./orders";
export type {
  Order,
  NewOrder,
  OrderItem,
  NewOrderItem,
  Transaction,
  NewTransaction,
} from "./orders";

export {
  marketplaceEnum,
  marketplaceConnectionStatusEnum,
  marketplaceListingStatusEnum,
  marketplaceConnections,
  marketplaceListings,
} from "./marketplaces";
export type {
  MarketplaceConnection,
  NewMarketplaceConnection,
  MarketplaceListing,
  NewMarketplaceListing,
} from "./marketplaces";

export { analyticsEvents, sellerAnalytics } from "./analytics";
export type {
  AnalyticsEvent,
  NewAnalyticsEvent,
  SellerAnalytic,
  NewSellerAnalytic,
} from "./analytics";

export { postStatusEnum, posts } from "./cms";
export type { Post, NewPost } from "./cms";

export {
  usersRelations,
  profilesRelations,
  sellersRelations,
  addressesRelations,
  wishlistsRelations,
  notificationsRelations,
  productCategoriesRelations,
  productsRelations,
  productVariantsRelations,
  productImagesRelations,
  designsRelations,
  reviewsRelations,
  couponsRelations,
  ordersRelations,
  orderItemsRelations,
  transactionsRelations,
  suppliersRelations,
  supplierProductsRelations,
  supplierConnectionsRelations,
  marketplaceConnectionsRelations,
  marketplaceListingsRelations,
  analyticsEventsRelations,
  sellerAnalyticsRelations,
  postsRelations,
} from "./relations";
