interface Type {
    _type: string
    _representation: string
    type_id: number
    name: string
    short_name: string
    display_order: number
    thread_type_url_name: string
    dealable: boolean
    type_universal_id: string
    topic_filterable: boolean
    filterable: boolean
}

interface Avatar {
    _type: string
    image_id: number
    uri: string
    large_uri: string
    large_width: number
    large_height: number
}

interface BestBadge {
    _type: string
    _representation: string
    badge_id: number
    level: number
    earned: number
}

interface Poster {
    _type: string
    _representation: string
    user_id: number
    username: string
    followable: boolean
    status: string
    joined: number
    icon_list_url: string
    icon_detail_url: string
    avatar: Avatar
    best_badge: BestBadge
}

interface Statistics {
    active_deal_count: number
    active_voucher_count: number
    comment_count: number
    thread_count: number
}

interface Image {
    _type: string
    image_id: number
    uri: string
    large_uri: string
    large_width: number
    large_height: number
}

interface MainGroup {
    _type: string
    group_id: number
    name: string
    url_name: string
    default: boolean
    followable: boolean
    followed: boolean
    statistics: Statistics
    submittable_thread_types: number[]
    sections: string[]
    pepper_url: string
    header_description: string
    hero_banner_smartphone_url: string
    hero_banner_tablet_url: string
    icon_list_url: string
    icon_detail_url: string
    image: Image
}

interface Merchant {
    _type: string
    merchant_id: number
    name: string
    url_name: string
    pepper_url: string
    merchant_external_url: string
    header_description: string
    icon_list_url: string
    icon_detail_url: string
    image: Image
}

interface Datum {
    _type: string
    _representation: string
    thread_id: number
    title: string
    origin: string
    submitted: number
    updated: number
    expired: boolean
    status: string
    local: boolean
    last_commented: number
    comment_count: number
    group_count: number
    hot_date: number
    price: number
    price_display: string
    deal_uri: string
    visit_uri: string
    short_uri: string
    temperature_rating: number
    temperature_level: string
    is_hot: boolean
    type: Type
    start_date: number
    flaggable: boolean
    votable: boolean
    editable: boolean
    group_display_summary: string
    tracking_pixel_url: string
    show_bumped_status: boolean
    display_price_as_free: boolean
    has_suggestion_cards: boolean
    icon_list_url: string
    icon_detail_url: string
    has_suggested_keywords: boolean
    clearance: boolean
    created: number
    is_new: boolean
    is_nsfw: boolean
    shareable_link: string
    poster: Poster
    image: Image
    group_ids: number[]
    main_group: MainGroup
    merchant: Merchant
}

interface DealabsRes {
    data: Datum[]
    messages: any[]
    validation: any[]
    additional_data: any
}

export { DealabsRes }
