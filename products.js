/**
 * THƯƠNG TỐC Express Tech - Product Database
 * 22+ Sản phẩm đa dạng phụ kiện công nghệ gồm cả HÀNG THƯỜNG và HÀNG FLASH SALE
 * Ảnh chất lượng cao chuẩn từng sản phẩm từ Unsplash
 */

const PRODUCTS_DATA = [
  // ==========================================
  // NHÓM 1: CỦ SẠC & CÁP SẠC
  // ==========================================
  {
    id: "SP-01",
    name: "Củ sạc GaN Ugreen 65W 3 cổng Nexode",
    brand: "Ugreen",
    category: "cu-sac-cap",
    price: 299000,
    originalPrice: 590000,
    discount: 49,
    rating: 5.0,
    reviewsCount: 432,
    soldCount: 1480,
    isFlashSale: true,
    flashSaleStock: 90,
    flashSaleSold: 76,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    badge: "SALE -49%",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "65W GaN III",
    colors: ["Xám Không Gian", "Trắng Ceramic"],
    specs: {
      "Thương hiệu": "Ugreen chính hãng",
      "Công suất": "65W Max (PD 3.0, PPS, QC 4.0+)",
      "Số cổng": "2x Type-C (65W) + 1x USB-A (22.5W)",
      "Công nghệ": "GaN III tản nhiệt lạnh",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Củ sạc GaN 65W 3 cổng bán chạy nhất, sạc cùng lúc MacBook, iPad và iPhone siêu nhanh."
  },
  {
    id: "SP-02",
    name: "Củ sạc Anker 20W Nano PD siêu nhỏ gọn",
    brand: "Anker",
    category: "cu-sac-cap",
    price: 280000,
    originalPrice: 280000,
    discount: 0,
    rating: 4.9,
    reviewsCount: 310,
    soldCount: 920,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80",
    badge: "HÀNG CHÍNH HÃNG",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "20W Power Delivery",
    colors: ["Trắng Tinh Khôi", "Đen Nhám", "Tím Lavender"],
    specs: {
      "Thương hiệu": "Anker USA",
      "Công suất": "20W Type-C PD",
      "Kích thước": "Siêu nhỏ gọn tương đương củ 5W của Apple",
      "Công nghệ": "PowerIQ 3.0 kiểm soát nhiệt an toàn",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Củ sạc 20W kích thước thu nhỏ 50%, bảo vệ pin iPhone tối đa không gây chai nóng máy."
  },
  {
    id: "SP-03",
    name: "Cáp Anker Type-C to Lightning 1.2m bọc dù",
    brand: "Anker",
    category: "cu-sac-cap",
    price: 149000,
    originalPrice: 320000,
    discount: 53,
    rating: 5.0,
    reviewsCount: 680,
    soldCount: 2240,
    isFlashSale: true,
    flashSaleStock: 120,
    flashSaleSold: 106,
    image: "https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?auto=format&fit=crop&w=800&q=80",
    badge: "SALE -53%",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "27W Apple MFi",
    colors: ["Đen Nhám", "Trắng Sữa", "Xanh Midnight"],
    specs: {
      "Thương hiệu": "Anker (MFi Apple Certified)",
      "Độ dài": "1.2 mét",
      "Chất liệu": "Sợi sinh học bọc dù 2 lớp chống đứt",
      "Độ bền": "Uốn cong hơn 25.000 lần",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Chứng chỉ Apple MFi chính hãng, không lo báo lỗi phụ kiện, dây dù siêu bền chống đứt gãy cổ."
  },
  {
    id: "SP-04",
    name: "Cáp sạc Baseus 100W hiển thị công suất LED",
    brand: "Baseus",
    category: "cu-sac-cap",
    price: 190000,
    originalPrice: 190000,
    discount: 0,
    rating: 4.9,
    reviewsCount: 215,
    soldCount: 650,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80",
    badge: "MÀN HÌNH LED",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "100W / Màn LED W",
    colors: ["Đen Carbon", "Xanh Rêu"],
    specs: {
      "Thương hiệu": "Baseus Display Series",
      "Công suất": "100W (20V/5A) Type-C to Type-C",
      "Màn hình": "Đèn LED hiển thị trực tiếp số Watt sạc",
      "Tốc độ truyền": "480Mbps",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Cáp Type-C to Type-C tích hợp màn hình LED đo công suất sạc thời gian thực cho Laptop và điện thoại."
  },
  {
    id: "SP-05",
    name: "Cáp sạc 3-in-1 Hoco đa năng bọc dù chống rối",
    brand: "Hoco",
    category: "cu-sac-cap",
    price: 69000,
    originalPrice: 150000,
    discount: 54,
    rating: 4.8,
    reviewsCount: 520,
    soldCount: 1980,
    isFlashSale: true,
    flashSaleStock: 100,
    flashSaleSold: 88,
    image: "https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=800",
    badge: "SALE -54%",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "3.5A Max Fast",
    colors: ["Đỏ Thể Thao", "Đen Carbon", "Vàng Gold"],
    specs: {
      "Thương hiệu": "Hoco Hong Kong",
      "Đầu cắm": "Lightning, Type-C, Micro-USB",
      "Dòng điện": "3.5A sạc cùng lúc 3 thiết bị",
      "Chất liệu": "Dây bọc silicon dẻo mềm chống rối",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Chỉ 1 sợi cáp dùng cho mọi loại máy trong gia đình hoặc để trên ô tô cực kỳ tiện lợi."
  },
  {
    id: "SP-06",
    name: "Củ sạc nhanh Baseus Super Si 20W Quick Charge",
    brand: "Baseus",
    category: "cu-sac-cap",
    price: 160000,
    originalPrice: 160000,
    discount: 0,
    rating: 4.8,
    reviewsCount: 290,
    soldCount: 880,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    badge: "HÀNG CHÍNH HÃNG",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "20W Super Si",
    colors: ["Đen Mờ", "Trắng Tinh Khôi"],
    specs: {
      "Thương hiệu": "Baseus chính hãng",
      "Công suất": "20W Type-C PD",
      "Công nghệ": "Super Silicon dẫn nhiệt nhanh, sạc mát",
      "Tương thích": "iPhone 11 đến iPhone 16 series",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Củ sạc Super Si chuẩn 20W sạc 50% pin trong 30 phút, tản nhiệt tốt không nóng máy."
  },
  {
    id: "SP-07",
    name: "Củ sạc để bàn Ugreen GaN 100W 4 cổng đa năng",
    brand: "Ugreen",
    category: "cu-sac-cap",
    price: 790000,
    originalPrice: 790000,
    discount: 0,
    rating: 5.0,
    reviewsCount: 160,
    soldCount: 380,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80",
    badge: "TRẠM SẠC VIP",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "100W 4 Cổng GaN",
    colors: ["Xám Không Gian"],
    specs: {
      "Thương hiệu": "Ugreen Desktop Charger",
      "Cổng cắm": "3x Type-C + 1x USB-A",
      "Công suất": "Đơn cổng đạt 100W Max",
      "Dây nguồn": "Dây nối dài 1.5m tiện lợi trên bàn làm việc",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Trạm sạc để bàn cao cấp cho dân văn phòng, gom gọn toàn bộ củ sạc cồng kềnh thành 1 thiết bị."
  },

  // ==========================================
  // NHÓM 2: PIN DỰ PHÒNG & NĂNG LƯỢNG
  // ==========================================
  {
    id: "SP-08",
    name: "Pin sạc dự phòng Baseus MagSafe 10.000mAh 20W",
    brand: "Baseus",
    category: "pin-du-phong",
    price: 380000,
    originalPrice: 650000,
    discount: 42,
    rating: 4.9,
    reviewsCount: 420,
    soldCount: 1150,
    isFlashSale: true,
    flashSaleStock: 80,
    flashSaleSold: 68,
    image: "https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=800",
    badge: "SALE -42%",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "20W Dây + 15W Từ Tính",
    colors: ["Trắng Sữa", "Xanh Pastel", "Đen Nhám"],
    specs: {
      "Thương hiệu": "Baseus Magnetic",
      "Dung lượng": "10.000mAh (Sạc hơn 2 lần iPhone 15)",
      "Lực hút": "Nam châm N52 lực hút mạnh 13N",
      "Cổng sạc": "Type-C 2 chiều 20W PD",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Hít chắc chắn mặt lưng iPhone 12 đến 16 series, sạc không dây 15W tiện dụng không cần mang cáp."
  },
  {
    id: "SP-09",
    name: "Pin dự phòng Anker PowerCore 20.000mAh Siêu Bền",
    brand: "Anker",
    category: "pin-du-phong",
    price: 650000,
    originalPrice: 650000,
    discount: 0,
    rating: 5.0,
    reviewsCount: 560,
    soldCount: 1480,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    badge: "BÁN CHẠY",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "22.5W PowerIQ",
    colors: ["Đen Carbon", "Trắng Tinh Khôi"],
    specs: {
      "Thương hiệu": "Anker USA",
      "Dung lượng": "20.000mAh sạc 4-5 lần điện thoại",
      "Cổng ra": "2x USB-A + 1x Type-C",
      "Công nghệ": "PowerIQ & VoltageBoost độc quyền",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Dòng pin nồi đồng cối đá từ Anker, dung lượng chuẩn 20.000mAh cho cả tuần năng lượng dồi dào."
  },
  {
    id: "SP-10",
    name: "Pin sạc mini Hoco 5000mAh cắm trực tiếp",
    brand: "Hoco",
    category: "pin-du-phong",
    price: 210000,
    originalPrice: 210000,
    discount: 0,
    rating: 4.8,
    reviewsCount: 380,
    soldCount: 1250,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=800&q=80",
    badge: "SIÊU NHỎ GỌN",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "12W Cắm Liền",
    colors: ["Hồng Baby", "Trắng Sữa", "Đen Huyền Bí"],
    specs: {
      "Thương hiệu": "Hoco Pocket Power",
      "Dung lượng": "5000mAh chuẩn bỏ túi son môi",
      "Chân cắm": "Chân cắm Lightning hoặc Type-C liền thân",
      "Trọng lượng": "Chỉ 95 gram",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Pin con nhộng cắm trực tiếp vào đuôi điện thoại không cần dây cáp, vừa sạc vừa lướt TikTok thoải mái."
  },
  {
    id: "SP-11",
    name: "Pin khủng 30.000mAh Baseus Star-Lord 22.5W Màn LED",
    brand: "Baseus",
    category: "pin-du-phong",
    price: 540000,
    originalPrice: 540000,
    discount: 0,
    rating: 4.9,
    reviewsCount: 290,
    soldCount: 620,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=800&q=80",
    badge: "PIN 7 NGÀY",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "22.5W Fast Charge",
    colors: ["Đen Mờ", "Trắng Băng"],
    specs: {
      "Thương hiệu": "Baseus Star-Lord",
      "Dung lượng": "30.000mAh dùng 7 ngày liên tục",
      "Màn hình": "LED kỹ thuật số báo % pin chuẩn",
      "Bảo vệ": "9 lớp chip an toàn chống cháy nổ",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Cứu cánh cho những chuyến phượt rừng, cắm trại hay công tác dài ngày không có ổ điện."
  },
  {
    id: "SP-12",
    name: "Thẻ Nhớ MicroSD SanDisk Extreme PRO 128GB 4K V30",
    brand: "SanDisk",
    category: "pin-du-phong",
    price: 295000,
    originalPrice: 295000,
    discount: 0,
    rating: 5.0,
    reviewsCount: 460,
    soldCount: 1120,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
    badge: "CHÍNH HÃNG USA",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "200MB/s Đọc",
    colors: ["Đen Đỏ SanDisk"],
    specs: {
      "Thương hiệu": "SanDisk USA chính hãng",
      "Dung lượng": "128GB Chuẩn A2 V30 U3",
      "Tốc độ": "Đọc 200MB/s - Ghi 90MB/s",
      "Tương thích": "Flycam, Camera 4K, GoPro, Điện thoại",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Thẻ nhớ tốc độ cao chuyên quay video 4K mượt mà không giật khung hình."
  },

  // ==========================================
  // NHÓM 3: THIẾT BỊ ÂM THANH & GAMING
  // ==========================================
  {
    id: "SP-13",
    name: "Tai nghe Bluetooth TWS Hoco EW04 True Wireless",
    brand: "Hoco",
    category: "tai-nghe-am-thanh",
    price: 189000,
    originalPrice: 350000,
    discount: 46,
    rating: 4.8,
    reviewsCount: 490,
    soldCount: 1720,
    isFlashSale: true,
    flashSaleStock: 75,
    flashSaleSold: 64,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    badge: "SALE -46%",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "Bluetooth 5.1 / Pin 4H",
    colors: ["Trắng Bóng", "Đen Mờ"],
    specs: {
      "Thương hiệu": "Hoco Technology",
      "Kết nối": "Bluetooth 5.1 tự kết nối khi mở nắp",
      "Thời lượng": "4 giờ đàm thoại/nghe nhạc + Dock sạc 20 giờ",
      "Cảm ứng": "Chạm đa điểm chuyển bài, nhận cuộc gọi",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Thiết kế in-ear cách âm chuẩn, Bass dày ấm, mic đàm thoại rõ ràng khi chạy xe máy ngoài đường."
  },
  {
    id: "SP-14",
    name: "Tai nghe Bluetooth Chụp tai Hoco W35 Pin 45H",
    brand: "Hoco",
    category: "tai-nghe-am-thanh",
    price: 320000,
    originalPrice: 320000,
    discount: 0,
    rating: 4.9,
    reviewsCount: 590,
    soldCount: 1350,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    badge: "HOT TRENDING",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "45H Pin / Loa 40mm",
    colors: ["Bạc Retro", "Đen Titan", "Xanh Navy"],
    specs: {
      "Thương hiệu": "Hoco",
      "Màng loa": "40mm âm vòm HiFi sống động",
      "Thời lượng pin": "45 giờ nghe liên tục",
      "Cổng cắm": "Bluetooth 5.3, Dây AUX 3.5mm, Thẻ nhớ TF",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Tai nghe phong cách Retro hot nhất giới trẻ hiện nay, đệm da thoáng khí êm tai không đau nhức."
  },
  {
    id: "SP-15",
    name: "Quạt tản nhiệt Gaming sò lạnh Memo DL05 Led RGB",
    brand: "Memo",
    category: "tai-nghe-am-thanh",
    price: 159000,
    originalPrice: 290000,
    discount: 45,
    rating: 4.9,
    reviewsCount: 410,
    soldCount: 1100,
    isFlashSale: true,
    flashSaleStock: 70,
    flashSaleSold: 61,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    badge: "SALE -45%",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "Sò lạnh đóng băng 3s",
    colors: ["Đen Gaming RGB", "Bạc Cơ Khí"],
    specs: {
      "Thương hiệu": "Memo Gaming",
      "Công nghệ": "Sò lạnh bán dẫn TEC hạ nhiệt xuống 8°C",
      "Màn hình": "Hiển thị nhiệt độ thân máy trực tiếp",
      "Độ ồn": "Dưới 20dB siêu êm ái",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Hạ nhiệt điện thoại tức thì trong 3 giây, giữ FPS 60-120 mượt mà khi leo rank Liên Quân, PUBG."
  },
  {
    id: "SP-16",
    name: "Loa Bluetooth Mini Ugreen Chống Nước Tiện Lợi",
    brand: "Ugreen",
    category: "tai-nghe-am-thanh",
    price: 450000,
    originalPrice: 450000,
    discount: 0,
    rating: 4.8,
    reviewsCount: 180,
    soldCount: 420,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    badge: "CHỐNG NƯỚC IPX7",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "5W RMS / Pin 8H",
    colors: ["Đen Nhám", "Xanh Rêu"],
    specs: {
      "Thương hiệu": "Ugreen Sound Series",
      "Công suất": "5W âm Bass cộng hưởng mạnh mẽ",
      "Kháng nước": "Chuẩn IPX7 chống nước đi mưa",
      "Pin": "8 giờ chơi nhạc liên tục",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Loa bỏ túi sang trọng với móc treo ba lô năng động, đồng hành cùng bạn trên mọi nẻo đường."
  },
  {
    id: "SP-17",
    name: "Tai Nghe Baseus Bowie M2+ Chống Ồn ANC 42dB",
    brand: "Baseus",
    category: "tai-nghe-am-thanh",
    price: 349000,
    originalPrice: 680000,
    discount: 48,
    rating: 4.9,
    reviewsCount: 310,
    soldCount: 790,
    isFlashSale: true,
    flashSaleStock: 60,
    flashSaleSold: 51,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    badge: "SALE -48%",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "ANC 42dB / BT 5.3",
    colors: ["Trắng Sứ", "Đen Phantom"],
    specs: {
      "Thương hiệu": "Baseus Bowie",
      "Chống ồn": "Chủ động Hybrid ANC 42dB lọc 95% tiếng ồn",
      "Độ trễ": "Cực thấp 0.038 giây chơi game cực đã",
      "Pin": "30 giờ kết hợp cùng dock sạc",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Chống ồn thông minh tự điều chỉnh theo môi trường, khử tiếng còi xe và tạp âm quán cafe."
  },
  {
    id: "SP-18",
    name: "Loa Bluetooth Di Động JBL Go 3 IP67 Siêu BASS",
    brand: "JBL",
    category: "tai-nghe-am-thanh",
    price: 690000,
    originalPrice: 690000,
    discount: 0,
    rating: 5.0,
    reviewsCount: 420,
    soldCount: 890,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    badge: "JBL CHÍNH HÃNG",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "4.2W Pro Sound",
    colors: ["Đỏ Thể Thao", "Xanh Dương", "Rằn Ri Camo"],
    specs: {
      "Thương hiệu": "JBL Harman",
      "Kháng nước bụi": "IP67 an toàn dưới nước 1m",
      "Pin": "5 giờ nghe nhạc liên tục",
      "Âm thanh": "JBL Pro Sound uy lực vượt trội",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Loa Bluetooth mini bán chạy nhất toàn cầu, âm bass sâu chắc nịch mang âm nhạc đến mọi bữa tiệc."
  },

  // ==========================================
  // NHÓM 4: PHỤ KIỆN & HUB
  // ==========================================
  {
    id: "SP-19",
    name: "Giá đỡ laptop hợp kim nhôm gấp gọn công thái học",
    brand: "Ugreen",
    category: "phu-kien-khac",
    price: 89000,
    originalPrice: 180000,
    discount: 51,
    rating: 4.9,
    reviewsCount: 740,
    soldCount: 2600,
    isFlashSale: true,
    flashSaleStock: 110,
    flashSaleSold: 97,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    badge: "SALE -51%",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "Nhôm CNC Chịu 15kg",
    colors: ["Bạc Silver", "Xám Không Gian"],
    specs: {
      "Thương hiệu": "Ugreen Ergonomics",
      "Chất liệu": "Hợp kim nhôm dày dặn cắt CNC",
      "Điều chỉnh": "6 nấc độ cao nâng màn hình ngang tầm mắt",
      "Tương thích": "Laptop, MacBook, iPad từ 11 đến 17 inch",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Chống mỏi vai gáy khi làm việc máy tính, giúp quạt tản nhiệt laptop hút gió thông thoáng hơn."
  },
  {
    id: "SP-20",
    name: "Hub chuyển đổi Ugreen Type-C sang HDMI/USB 5-in-1",
    brand: "Ugreen",
    category: "phu-kien-khac",
    price: 490000,
    originalPrice: 490000,
    discount: 0,
    rating: 4.9,
    reviewsCount: 280,
    soldCount: 710,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80",
    badge: "HDMI 4K 60HZ",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "PD 100W + 4K HDMI",
    colors: ["Xám Không Gian"],
    specs: {
      "Thương hiệu": "Ugreen Multifunction Hub",
      "Cổng xuất": "1x HDMI 4K@60Hz, 3x USB 3.0 5Gbps, 1x Type-C PD 100W",
      "Vỏ máy": "Hợp kim nhôm tản nhiệt mát",
      "Tương thích": "MacBook, iPad Pro, Surface, Laptop Windows",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Hub 5-in-1 thiết yếu để cắm máy chiếu, cắm chuột bàn phím và sạc nhanh 100W cùng lúc."
  },
  {
    id: "SP-21",
    name: "Giá đỡ điện thoại xoay 360 độ để bàn kim loại",
    brand: "Hoco",
    category: "phu-kien-khac",
    price: 75000,
    originalPrice: 75000,
    discount: 0,
    rating: 4.7,
    reviewsCount: 390,
    soldCount: 1540,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80",
    badge: "GIÁ RẺ 75K",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "Xoay 360 Độ",
    colors: ["Đen Nhám", "Trắng Bạc"],
    specs: {
      "Thương hiệu": "Hoco Stand",
      "Chất liệu": "Kim loại gia cố đệm chống trượt silicone",
      "Khớp xoay": "Xoay 360 độ kèm tiếng bánh răng cơ học đã tai",
      "Tương thích": "Tất cả các dòng điện thoại thông minh",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Đế kim loại nặng đầm tay không lo ngã điện thoại khi xem phim, lướt tin tức hay gọi video call."
  },
  {
    id: "SP-22",
    name: "Giá Đỡ Ô Tô Baseus MagSafe Xoay 360 Gắn Cửa Gió",
    brand: "Baseus",
    category: "phu-kien-khac",
    price: 199000,
    originalPrice: 199000,
    discount: 0,
    rating: 4.9,
    reviewsCount: 220,
    soldCount: 840,
    isFlashSale: false,
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80",
    badge: "CHUYÊN XE HƠI",
    warranty: "12 tháng 1 đổi 1 tận nhà",
    power: "16 Nam Châm N52",
    colors: ["Đen Carbon", "Bạc Chrome"],
    specs: {
      "Thương hiệu": "Baseus Auto Series",
      "Lực hút": "16 nam châm N52 lực hút cực mạnh không rơi",
      "Khớp nối": "Cầu xoay 360 độ tùy chỉnh mọi góc nhìn",
      "Đuôi kẹp": "Khóa vít móc kim loại kẹp chắc vào khe gió",
      "Bảo hành": "12 tháng 1 đổi 1 tận nhà tại Biên Hòa"
    },
    shortDesc: "Giữ điện thoại chắc chắn khi tra bản đồ Google Maps lái xe an toàn trên đường phố Biên Hòa."
  }
];

// Cấu hình giao hàng
const SHIPPING_CONFIG = {
  expressFee: 15000, // 15.000đ nội thành Biên Hòa
  expressFreeThreshold: 200000, // Miễn phí từ 200.000đ
  standardFee: 30000, // Toàn quốc 30.000đ
  standardFreeThreshold: 400000
};

// Danh sách Voucher
const DISCOUNT_VOUCHERS = {
  "THUONGTOC10": {
    code: "THUONGTOC10",
    type: "percent",
    value: 10,
    minOrder: 0,
    label: "Giảm 10%",
    desc: "Giảm 10% tổng hóa đơn"
  },
  "FREESHIP1H": {
    code: "FREESHIP1H",
    type: "shipping",
    value: 15000,
    minOrder: 200000,
    label: "Freeship 1H",
    desc: "Miễn phí ship hỏa tốc 1 giờ cho đơn từ 200k"
  },
  "FLASHSALE50": {
    code: "FLASHSALE50",
    type: "fixed",
    value: 50000,
    minOrder: 250000,
    label: "Giảm 50K",
    desc: "Giảm 50.000đ trực tiếp cho đơn từ 250k"
  }
};

// Phường tại Biên Hòa
const BIEN_HOA_WARDS = [
  { name: "Phường Trảng Dài", eta: "25 - 35 phút" },
  { name: "Phường Tân Phong", eta: "20 - 30 phút" },
  { name: "Phường Hố Nai", eta: "25 - 40 phút" },
  { name: "Phường Tam Hiệp", eta: "20 - 35 phút" },
  { name: "Phường Quyết Thắng", eta: "30 - 45 phút" },
  { name: "Phường Thống Nhất", eta: "30 - 45 phút" },
  { name: "Phường Long Bình", eta: "35 - 50 phút" },
  { name: "Phường Long Bình Tân", eta: "40 - 55 phút" },
  { name: "Phường Tân Hiệp", eta: "25 - 35 phút" },
  { name: "Phường Quang Vinh", eta: "30 - 45 phút" },
  { name: "Phường Bửu Long", eta: "35 - 50 phút" },
  { name: "Phường An Bình", eta: "35 - 50 phút" }
];
