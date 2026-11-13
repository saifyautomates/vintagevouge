package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"sync"
	"time"
)

// Measurements represents flat-laid tape dimensions
type Measurements struct {
	PitToPit  string `json:"pitToPit"`
	Length    string `json:"length"`
	Shoulders string `json:"shoulders"`
	Sleeve    string `json:"sleeve"`
}

// Product represents a 1-of-1 archival garment specimen
type Product struct {
	ID                    string       `json:"id"`
	ReferenceCode         string       `json:"referenceCode"`
	Title                 string       `json:"title"`
	Subtitle              string       `json:"subtitle"`
	Category              string       `json:"category"`
	Era                   string       `json:"era"`
	Origin                string       `json:"origin"`
	Price                 int          `json:"price"` // Strictly in INR (₹)
	OriginalEstimatePrice int          `json:"originalEstimatePrice"`
	Size                  string       `json:"size"`
	ConditionRating       string       `json:"conditionRating"`
	Rarity                string       `json:"rarity"`
	DropBatch             string       `json:"dropBatch"`
	Fabric                string       `json:"fabric"`
	Measurements          Measurements `json:"measurements"`
	Description           string       `json:"description"`
	Provenance            string       `json:"provenance"`
	Images                []string     `json:"images"`
	InStock               bool         `json:"inStock"`
	Featured              bool         `json:"featured"`
	CreatedAt             string       `json:"createdAt"`
	UpdatedAt             string       `json:"updatedAt"`
}

type OrderItem struct {
	ProductID     string `json:"productId"`
	ReferenceCode string `json:"referenceCode"`
	Title         string `json:"title"`
	Size          string `json:"size"`
	UnitPrice     int    `json:"unitPrice"`
	Quantity      int    `json:"quantity"`
}

type Order struct {
	ID             string      `json:"id"`
	Channel        string      `json:"channel"`
	CustomerName   string      `json:"customerName"`
	CustomerContact string     `json:"customerContact"`
	Items          []OrderItem `json:"items"`
	Subtotal       int         `json:"subtotal"`
	DiscountAmount int         `json:"discountAmount"`
	TotalAmount    int         `json:"totalAmount"` // in INR (₹)
	PaymentMethod  string      `json:"paymentMethod"`
	Status         string      `json:"status"`
	TrackingNumber string      `json:"trackingNumber"`
	Timestamp      string      `json:"timestamp"`
	CreatedAt      string      `json:"createdAt"`
}

type DropConfig struct {
	CurrentDropNumber int    `json:"currentDropNumber"`
	DropTitle         string `json:"dropTitle"`
	ScheduledLaunch   string `json:"scheduledLaunch"`
	IsVipGateLocked   bool   `json:"isVipGateLocked"`
	TotalSpecimens    int    `json:"totalSpecimens"`
}

type CheckoutRequest struct {
	Channel         string   `json:"channel"`
	CustomerName    string   `json:"customerName"`
	CustomerContact string   `json:"customerContact"`
	ProductIDs      []string `json:"productIds"`
	DiscountPercent int      `json:"discountPercent"`
	PaymentMethod   string   `json:"paymentMethod"`
}

type CheckoutResponse struct {
	Order                   Order  `json:"order"`
	UPIPaymentString        string `json:"upiPaymentString"`
	WhatsAppNotificationURL string `json:"whatsAppNotificationUrl"`
	ThermalReceiptPreview   string `json:"thermalReceiptPreview"`
}

type PosScanRequest struct {
	Query string `json:"query"`
}

type VerifyDropRequest struct {
	Passcode string `json:"passcode"`
}

// In-Memory Thread-Safe High-Performance Database Engine
type Database struct {
	sync.RWMutex
	Products   []Product
	Orders     []Order
	DropConfig DropConfig
}

var db = &Database{
	DropConfig: DropConfig{
		CurrentDropNumber: 24,
		DropTitle:         "Drop #24 — The Autumn Nomad",
		ScheduledLaunch:   "2026-11-20T18:00:00+05:30",
		IsVipGateLocked:   true,
		TotalSpecimens:    10,
	},
	Products: []Product{
		{
			ID: "vv-d24-01", ReferenceCode: "VV-D24-01", Title: "Boxy Cut Chain-Stitched Western Camp Shirt",
			Subtitle: "Chain-Stitch Floral Motifs & Mother of Pearl Snaps", Category: "boxy-shirts",
			Era: "Circa 1992", Origin: "Tokyo Sourced • Curated in Kota Studio",
			Price: 3499, OriginalEstimatePrice: 6500, Size: "Boxy M", ConditionRating: "9.8/10 Near Mint",
			Rarity: "1-of-1 Specimen", DropBatch: "Drop #24 — The Autumn Nomad",
			Fabric: "100% Sandwashed Rayon Twill",
			Measurements: Measurements{PitToPit: "23.5 in / 60 cm", Length: "26.8 in / 68 cm", Shoulders: "20.2 in / 51 cm", Sleeve: "9.5 in / 24 cm"},
			Description: "Ultra-rare 90s Japanese boxy camp collar shirt featuring hand-guided contrast chain-stitch embroidery on front yokes. Natural drape with drop-shoulder silhouette.",
			Provenance: "Archival estate discovery from Shimokitazawa, Tokyo. Dry-pressed and eucalyptus steam sanitized at our Kota studio.",
			Images: []string{"/assets/images/boxy-embroidered-shirt.jpg"}, InStock: true, Featured: true,
			CreatedAt: "2026-11-01T10:00:00Z", UpdatedAt: "2026-11-01T10:00:00Z",
		},
		{
			ID: "vv-d24-02", ReferenceCode: "VV-D24-02", Title: "Washed Indigo 14oz Denim Trucker Overshirt",
			Subtitle: "Sun-Faded Whisker Wear & Copper Shank Hardware", Category: "denim-workwear",
			Era: "Late 90s Archive", Origin: "Nagoya Flea Market • Hand-Selected for India",
			Price: 4299, OriginalEstimatePrice: 7800, Size: "Oversized L", ConditionRating: "9.4/10 Authentic Patina",
			Rarity: "1-of-1 Specimen", DropBatch: "Drop #24 — The Autumn Nomad",
			Fabric: "14oz Ring-Spun Japanese Shuttle Loom Denim",
			Measurements: Measurements{PitToPit: "25.0 in / 63.5 cm", Length: "28.5 in / 72.4 cm", Shoulders: "21.5 in / 54.6 cm", Sleeve: "24.8 in / 63 cm"},
			Description: "Heavyweight 14oz shuttle-loomed selvedge denim trucker overshirt. Authentic sun fade honeycomb patterns along forearms and natural patina wash.",
			Provenance: "Sourced in central Japan. Restored with authentic copper rivet reinforcement in Kota.",
			Images: []string{"/assets/images/vintage-denim-trucker.jpg"}, InStock: true, Featured: true,
			CreatedAt: "2026-11-01T10:00:00Z", UpdatedAt: "2026-11-01T10:00:00Z",
		},
		{
			ID: "vv-d24-03", ReferenceCode: "VV-D24-03", Title: "1988 Distressed Lambskin Aviator Bomber Jacket",
			Subtitle: "Ribbed Storm Trim & Heavyweight Talon Brass Zip", Category: "leather-jackets",
			Era: "Circa 1988", Origin: "Osaka Vintage Vault • Restored in Kota",
			Price: 8499, OriginalEstimatePrice: 16500, Size: "Oversized L", ConditionRating: "9.4/10 Authentic Patina",
			Rarity: "Vault Archive", DropBatch: "Drop #24 — The Autumn Nomad",
			Fabric: "Full-Grain Vegetable-Tanned Lambskin",
			Measurements: Measurements{PitToPit: "25.5 in / 65 cm", Length: "27.2 in / 69 cm", Shoulders: "22.0 in / 56 cm", Sleeve: "25.2 in / 64 cm"},
			Description: "Buttery lambskin flight bomber with decades of genuine character. Quilted viscose lining, heavyweight Talon brass hardware, and authentic shoulder drape.",
			Provenance: "Treated with beeswax conditioning balm and eucalyptus steam in our Kota restoration workshop.",
			Images: []string{"/assets/images/vintage-leather-bomber.jpg"}, InStock: true, Featured: true,
			CreatedAt: "2026-11-01T10:00:00Z", UpdatedAt: "2026-11-01T10:00:00Z",
		},
		{
			ID: "vv-d24-04", ReferenceCode: "VV-D24-04", Title: "Oversized Striped Cotton Poplin Leisure Shirt",
			Subtitle: "Relaxed Drop-Shoulder Silhouette with French Placket", Category: "boxy-shirts",
			Era: "Mid 90s Vintage", Origin: "Kyoto Textile Exchange • Curated in India",
			Price: 2899, OriginalEstimatePrice: 5000, Size: "Boxy M", ConditionRating: "9.8/10 Near Mint",
			Rarity: "1-of-1 Specimen", DropBatch: "Drop #24 — The Autumn Nomad",
			Fabric: "100% Long-Staple Compact Poplin Cotton",
			Measurements: Measurements{PitToPit: "24.0 in / 61 cm", Length: "29.0 in / 73.6 cm", Shoulders: "20.8 in / 53 cm", Sleeve: "23.5 in / 59.7 cm"},
			Description: "Crisp washed yarn-dyed poplin striped shirt. Perfect breezy cut for Indian autumn weather.",
			Provenance: "Sanitized and mother-of-pearl buttons hand-reinforced at Kota Hub.",
			Images: []string{"/assets/images/oversized-vintage-shirt.jpg"}, InStock: true, Featured: false,
			CreatedAt: "2026-11-01T10:00:00Z", UpdatedAt: "2026-11-01T10:00:00Z",
		},
		{
			ID: "vv-d24-05", ReferenceCode: "VV-D24-05", Title: "Reworked 70s Prairie Floral Tiered Midi Dress",
			Subtitle: "Ruffled Neckline, Corset Tie Back & Antique Calico", Category: "dresses-corsets",
			Era: "Circa 1976", Origin: "Pasadena Rose Bowl Flea • Curated in Kota",
			Price: 3899, OriginalEstimatePrice: 7200, Size: "Free Size", ConditionRating: "9.8/10 Near Mint",
			Rarity: "1-of-1 Specimen", DropBatch: "Drop #24 — The Autumn Nomad",
			Fabric: "100% Breathable Gauze Calico Cotton",
			Measurements: Measurements{PitToPit: "18.0 - 20.5 in", Length: "46.0 in / 116.8 cm", Shoulders: "15.5 in / 39.4 cm", Sleeve: "23.0 in / 58.4 cm"},
			Description: "Stunning 1970s authentic bohemian prairie midi dress. Hand-gathered tiers and adjustable corset back.",
			Provenance: "Deep steam sanitized with organic lavender mist. Preserved original cotton lace detailing.",
			Images: []string{"/assets/images/retro-floral-dress.jpg"}, InStock: true, Featured: true,
			CreatedAt: "2026-11-01T10:00:00Z", UpdatedAt: "2026-11-01T10:00:00Z",
		},
		{
			ID: "vv-d24-06", ReferenceCode: "VV-D24-06", Title: "1994 Sonic Youth Tour Faded Heavyweight Tee",
			Subtitle: "Single-Stitch Hem, Cracked Plastisol Print & Charcoal Fade", Category: "vintage-tees",
			Era: "1994 World Tour", Origin: "San Francisco Archive • Authenticated in Kota",
			Price: 3699, OriginalEstimatePrice: 9000, Size: "Oversized L", ConditionRating: "9.0/10 Distressed Vintage",
			Rarity: "Rare Thrift Find", DropBatch: "Drop #24 — The Autumn Nomad",
			Fabric: "100% Pre-Shrunk Open-End Heavy Cotton",
			Measurements: Measurements{PitToPit: "23.0 in / 58.5 cm", Length: "29.5 in / 75 cm", Shoulders: "21.0 in / 53.3 cm", Sleeve: "8.5 in / 21.6 cm"},
			Description: "Genuine 1994 concert memorabilia with authentic single-needle hems on sleeves and waist.",
			Provenance: "Archival blacklight fiber tested for authentic 90s cotton weave. Sanitized in Kota.",
			Images: []string{"/assets/images/vintage-band-tee.jpg"}, InStock: true, Featured: false,
			CreatedAt: "2026-11-01T10:00:00Z", UpdatedAt: "2026-11-01T10:00:00Z",
		},
		{
			ID: "vv-d24-07", ReferenceCode: "VV-D24-07", Title: "Chunky Wale Corduroy Western Overshirt",
			Subtitle: "Deep Tobacco Rust with Embossed Brass Buttons", Category: "boxy-shirts",
			Era: "Late 80s Vintage", Origin: "Seattle Vintage Flea • Curated in India",
			Price: 3299, OriginalEstimatePrice: 5800, Size: "Relaxed XL", ConditionRating: "9.8/10 Near Mint",
			Rarity: "1-of-1 Specimen", DropBatch: "Drop #24 — The Autumn Nomad",
			Fabric: "8-Wale 100% Cotton Velvet Corduroy",
			Measurements: Measurements{PitToPit: "26.0 in / 66 cm", Length: "30.0 in / 76.2 cm", Shoulders: "22.5 in / 57 cm", Sleeve: "24.5 in / 62.2 cm"},
			Description: "Heavy 8-wale textured corduroy overshirt in signature autumn rust tone.",
			Provenance: "Sourced in the Pacific Northwest, dry-brushed and sanitized at Kota Studio.",
			Images: []string{"/assets/images/corduroy-overshirt.jpg"}, InStock: true, Featured: false,
			CreatedAt: "2026-11-01T10:00:00Z", UpdatedAt: "2026-11-01T10:00:00Z",
		},
		{
			ID: "vv-d24-08", ReferenceCode: "VV-D24-08", Title: "Vintage Blanket-Lined Detroit Canvas Work Jacket",
			Subtitle: "Corduroy Collar, Aged Brass Rivets & Distressed Duck Canvas", Category: "denim-workwear",
			Era: "Early 90s Vintage", Origin: "Detroit Heritage Archive • Restored in Kota",
			Price: 5999, OriginalEstimatePrice: 12000, Size: "Boxy M", ConditionRating: "9.4/10 Authentic Patina",
			Rarity: "Vault Archive", DropBatch: "Drop #24 — The Autumn Nomad",
			Fabric: "12oz Heavy Duck Canvas with Acrylic Blanket Lining",
			Measurements: Measurements{PitToPit: "24.5 in / 62.2 cm", Length: "26.5 in / 67.3 cm", Shoulders: "20.5 in / 52 cm", Sleeve: "24.0 in / 61 cm"},
			Description: "The holy grail vintage silhouette: cropped boxy hem, heavy duck canvas, deep brown corduroy collar.",
			Provenance: "Cleaned, sanitized, and zipper track serviced in Kota workshop.",
			Images: []string{"/assets/images/vintage-workwear-jacket.jpg"}, InStock: true, Featured: true,
			CreatedAt: "2026-11-01T10:00:00Z", UpdatedAt: "2026-11-01T10:00:00Z",
		},
		{
			ID: "vv-d24-09", ReferenceCode: "VV-D24-09", Title: "90s BDU Ripstop Parachute Cargo Trousers",
			Subtitle: "Drawcord Ankle Cuffs, 6-Pocket Utility & Olive Drab Fade", Category: "denim-workwear",
			Era: "Circa 1995", Origin: "Tokyo Military Surplus Archive • Curated in India",
			Price: 3499, OriginalEstimatePrice: 6500, Size: "Relaxed XL", ConditionRating: "9.8/10 Near Mint",
			Rarity: "1-of-1 Specimen", DropBatch: "Drop #24 — The Autumn Nomad",
			Fabric: "100% Cotton Cross-Hatch Ripstop Weave",
			Measurements: Measurements{PitToPit: "Waist: 34 - 38 in", Length: "Inseam: 31.0 in", Shoulders: "Thigh: 14.5 in", Sleeve: "Leg Opening: 9.5 in"},
			Description: "Authentic vintage military surplus cargo trousers with reinforced knee and seat panels.",
			Provenance: "Steam sanitized and side tension adjusters calibrated at Kota Hub.",
			Images: []string{"/assets/images/vintage-cargo-trousers.jpg"}, InStock: true, Featured: false,
			CreatedAt: "2026-11-01T10:00:00Z", UpdatedAt: "2026-11-01T10:00:00Z",
		},
		{
			ID: "vv-d24-10", ReferenceCode: "VV-D24-10", Title: "Victorian Broderie Anglaise Cotton Blouse",
			Subtitle: "Scalloped High Collar, Pintuck Pleating & Pearl Buttons", Category: "dresses-corsets",
			Era: "Late Victorian Revival (Circa 1978)", Origin: "London Portobello Road • Sourced for India",
			Price: 3199, OriginalEstimatePrice: 6000, Size: "S", ConditionRating: "10/10 Deadstock",
			Rarity: "1-of-1 Specimen", DropBatch: "Drop #24 — The Autumn Nomad",
			Fabric: "100% Crisp Lawn Cotton with Eyelet Embroidery",
			Measurements: Measurements{PitToPit: "19.0 in / 48.3 cm", Length: "24.5 in / 62.2 cm", Shoulders: "15.0 in / 38 cm", Sleeve: "23.5 in / 59.7 cm"},
			Description: "Ethereal deadstock condition eyelet lace blouse with micro-pintucking along front placket.",
			Provenance: "Found unwashed deadstock in European archive; freshly steam sterilized in Kota.",
			Images: []string{"/assets/images/vintage-prairie-dress.jpg"}, InStock: true, Featured: false,
			CreatedAt: "2026-11-01T10:00:00Z", UpdatedAt: "2026-11-01T10:00:00Z",
		},
	},
	Orders: []Order{},
}

func enableCorsAndSecurity(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	(*w).Header().Set("X-Content-Type-Options", "nosniff")
	(*w).Header().Set("X-Frame-Options", "SAMEORIGIN")
	(*w).Header().Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains")
	(*w).Header().Set("Content-Type", "application/json")
}

func main() {
	mux := http.NewServeMux()

	// 1. Health check & Telemetry
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		enableCorsAndSecurity(&w)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":            "ONLINE",
			"engine":            "Go 1.22 Native Concurrency",
			"concurrencyModel":  "Goroutines + Channels + sync.RWMutex",
			"hub":               "Sogaria / Workshop Road, Kota, Rajasthan – 324002",
			"currency":          "INR (₹) Strictly",
			"latency":           "< 1ms",
			"timestamp":         time.Now().Format(time.RFC3339),
		})
	})
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		enableCorsAndSecurity(&w)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":   "ONLINE",
			"engine":   "Go 1.22 Native Concurrency",
			"hub":      "Sogaria / Workshop Road, Kota, Rajasthan – 324002",
			"currency": "INR (₹) Strictly",
		})
	})

	// 2. Products Catalog
	mux.HandleFunc("/api/products", func(w http.ResponseWriter, r *http.Request) {
		enableCorsAndSecurity(&w)
		if r.Method == http.MethodOptions {
			return
		}
		db.RLock()
		defer db.RUnlock()
		json.NewEncoder(w).Encode(db.Products)
	})

	// 3. POS Barcode Scan Lookup
	mux.HandleFunc("/api/pos/scan", func(w http.ResponseWriter, r *http.Request) {
		enableCorsAndSecurity(&w)
		if r.Method == http.MethodOptions {
			return
		}
		var req PosScanRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error":"Invalid payload"}`, http.StatusBadRequest)
			return
		}
		target := strings.ToLower(strings.TrimSpace(req.Query))
		db.RLock()
		defer db.RUnlock()
		for _, p := range db.Products {
			if strings.ToLower(p.ID) == target || strings.ToLower(p.ReferenceCode) == target {
				json.NewEncoder(w).Encode(p)
				return
			}
		}
		http.Error(w, `{"error":"Specimen not found"}`, http.StatusNotFound)
	})

	// 4. POS Shift Summary
	mux.HandleFunc("/api/pos/summary", func(w http.ResponseWriter, r *http.Request) {
		enableCorsAndSecurity(&w)
		if r.Method == http.MethodOptions {
			return
		}
		db.RLock()
		defer db.RUnlock()
		var totalPosRevenue, upiCollected, cashDrawer, posOrderCount int
		for _, o := range db.Orders {
			if o.Channel == "In-Store POS" {
				posOrderCount++
				totalPosRevenue += o.TotalAmount
				if strings.Contains(o.PaymentMethod, "UPI") {
					upiCollected += o.TotalAmount
				} else {
					cashDrawer += o.TotalAmount
				}
			}
		}
		json.NewEncoder(w).Encode(map[string]interface{}{
			"shiftStatus":           "ACTIVE",
			"counterLocation":       "Kota Studio Register #1",
			"posOrderCount":         posOrderCount,
			"totalPOSRevenueINR":    totalPosRevenue,
			"upiCollectedINR":       upiCollected,
			"cashDrawerExpectedINR": cashDrawer,
			"currency":              "INR (₹)",
		})
	})

	// 5. Drop Configuration
	mux.HandleFunc("/api/drop", func(w http.ResponseWriter, r *http.Request) {
		enableCorsAndSecurity(&w)
		if r.Method == http.MethodOptions {
			return
		}
		db.RLock()
		defer db.RUnlock()
		json.NewEncoder(w).Encode(db.DropConfig)
	})

	// 6. Drop Passcode Verification
	mux.HandleFunc("/api/drop/verify", func(w http.ResponseWriter, r *http.Request) {
		enableCorsAndSecurity(&w)
		if r.Method == http.MethodOptions {
			return
		}
		var req VerifyDropRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error":"Invalid payload"}`, http.StatusBadRequest)
			return
		}
		isValid := strings.EqualFold(strings.TrimSpace(req.Passcode), "NOMAD1992")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"valid":         isValid,
			"accessGranted": isValid,
		})
	})

	// 7. Atomic Multi-Item Checkout Engine
	mux.HandleFunc("/api/checkout", func(w http.ResponseWriter, r *http.Request) {
		enableCorsAndSecurity(&w)
		if r.Method == http.MethodOptions {
			return
		}
		if r.Method != http.MethodPost {
			http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
			return
		}

		var req CheckoutRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error":"Invalid request payload"}`, http.StatusBadRequest)
			return
		}

		db.Lock()
		defer db.Unlock()

		// Verify availability of all 1-of-1 pieces atomically
		var selectedProducts []Product
		subtotal := 0
		for _, id := range req.ProductIDs {
			found := false
			for i, p := range db.Products {
				if p.ID == id || p.ReferenceCode == id {
					if !p.InStock {
						http.Error(w, fmt.Sprintf(`{"error":"Conflict: Specimen [%s] is already claimed"}`, p.ReferenceCode), http.StatusConflict)
						return
					}
					selectedProducts = append(selectedProducts, db.Products[i])
					subtotal += p.Price
					found = true
					break
				}
			}
			if !found {
				http.Error(w, fmt.Sprintf(`{"error":"Product %s not found"}`, id), http.StatusNotFound)
				return
			}
		}

		// Deduct stock atomically
		for _, sel := range selectedProducts {
			for i := range db.Products {
				if db.Products[i].ID == sel.ID {
					db.Products[i].InStock = false
					db.Products[i].UpdatedAt = time.Now().Format(time.RFC3339)
				}
			}
		}

		discount := (subtotal * req.DiscountPercent) / 100
		totalAmount := subtotal - discount

		tracking := fmt.Sprintf("BD-%08d-IN", rand.Intn(90000000)+10000000)
		if req.Channel == "In-Store POS" {
			tracking = fmt.Sprintf("POS-KOTA-CTR-%03d", rand.Intn(900)+100)
		}

		orderItems := make([]OrderItem, len(selectedProducts))
		for i, p := range selectedProducts {
			orderItems[i] = OrderItem{
				ProductID: p.ID, ReferenceCode: p.ReferenceCode,
				Title: p.Title, Size: p.Size, UnitPrice: p.Price, Quantity: 1,
			}
		}

		channel := req.Channel
		if channel == "" {
			channel = "Online Storefront"
		}
		pm := req.PaymentMethod
		if pm == "" {
			pm = "Bharat UPI"
		}

		order := Order{
			ID:              fmt.Sprintf("ORD-%d", time.Now().UnixNano()/1000000),
			Channel:         channel,
			CustomerName:    req.CustomerName,
			CustomerContact: req.CustomerContact,
			Items:           orderItems,
			Subtotal:        subtotal,
			DiscountAmount:  discount,
			TotalAmount:     totalAmount,
			PaymentMethod:   pm,
			Status:          "Sanitizing",
			TrackingNumber:  tracking,
			Timestamp:       time.Now().Format("02 Jan 2006, 03:04 PM IST"),
			CreatedAt:       time.Now().Format(time.RFC3339),
		}
		if channel == "In-Store POS" {
			order.Status = "Completed"
		}

		db.Orders = append([]Order{order}, db.Orders...)

		upiPayment := fmt.Sprintf("upi://pay?pa=vintagevogue@upi&pn=Vintage%%20Vogue%%20India&am=%d&cu=INR&tn=VV-Order-%s", totalAmount, order.ID)
		whatsapp := fmt.Sprintf("https://wa.me/919829012345?text=Order%%20Confirmed%%20%%23%s%%20Total%%20INR%%20%d", order.ID, totalAmount)

		json.NewEncoder(w).Encode(CheckoutResponse{
			Order:                   order,
			UPIPaymentString:        upiPayment,
			WhatsAppNotificationURL: whatsapp,
		})
	})

	// 8. Orders Ledger
	mux.HandleFunc("/api/orders", func(w http.ResponseWriter, r *http.Request) {
		enableCorsAndSecurity(&w)
		if r.Method == http.MethodOptions {
			return
		}
		db.RLock()
		defer db.RUnlock()
		json.NewEncoder(w).Encode(db.Orders)
	})

	port := ":8080"
	log.Printf("⚡ [Go Native Engine] High-performance backend running on http://localhost%s\n", port)
	log.Printf("Studio: Sogaria / Workshop Road, Kota, Rajasthan – 324002\n")
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("Server startup failure: %v", err)
	}
}
