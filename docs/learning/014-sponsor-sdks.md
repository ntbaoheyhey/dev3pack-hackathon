# 014 — Chọn SDK nhà tài trợ theo nhu cầu sản phẩm

> Ngày kiểm tra: **17/11/2026** (Asia/Ho_Chi_Minh). Thể lệ được đọc trực tiếp bằng browser tại [Dev3pack](https://hack.dev3pack.xyz) và [FAQ](https://hack.dev3pack.xyz/faq). Docs/pricing đã đối chiếu ở link cụ thể bên dưới; mẫu tích hợp chưa chạy, chưa cài package hoặc tạo API key.

## 1. Mục tiêu và điều cần nhớ

**Chỉ tích hợp SDK khi phục vụ sản phẩm thật; chờ BTC công bố partner track trước kickoff rồi mới chọn.** Mọi dự án mặc định vào track Solana. Hiện chưa công bố track DePIN/AI Agent hay bounty riêng cho từng sponsor; dùng bốn SDK không xác nhận đủ điều kiện bốn bounty. Nếu có partner track, giám khảo kiểm dự án thực sự dùng công nghệ và đáp ứng điều kiện.

Sponsors: **Firecrawl, ElevenLabs, Supabase, Solana Mobile, Solana**. Supporters: **Blockchain Developer Report, Bonfires**. Bốn SDK trong note là bốn lựa chọn tích hợp ngoài phần Solana cốt lõi, không phải toàn bộ danh sách sponsor. [Trang chủ](https://hack.dev3pack.xyz), kiểm tra 17/11/2026.

## 2. Phiên bản và bằng chứng kiểm tra

| Thành phần | Mốc dùng trong note | Bằng chứng / giới hạn |
| --- | --- | --- |
| Supabase | JavaScript docs hiện hành | [Client reference](https://supabase.com/docs/reference/javascript/introduction); chưa khóa/chạy package trong repo |
| ElevenLabs | REST v1 TTS | [Create speech](https://elevenlabs.io/docs/api-reference/text-to-speech/convert); không cần giả định version Node SDK |
| Firecrawl | REST **v2** scrape | [Scrape](https://docs.firecrawl.dev/features/scrape); thay mẫu SDK cũ chưa kiểm chứng |
| Solana Mobile | MWA; xem version/type tại [008](008-solana-mobile-seeker.md) | [Protocol spec](https://solana-mobile.github.io/mobile-wallet-adapter/spec/spec.html); chưa thử thiết bị |
| Thể lệ | Trang chủ/FAQ ngày 17/11/2026 | Đã đọc nội dung JS bằng browser; không suy bounty từ pricing SDK |

## 3. Kiến thức chính

### 3.1. SDK phục vụ phần nào của sản phẩm?

| Lựa chọn | Tình huống có ích | Điều cần kiểm tra |
| --- | --- | --- |
| Supabase | Hồ sơ, dữ liệu off-chain, Realtime, storage | Auth/session thật, RLS, quyền bảng và quota; không coi dữ liệu DB là trạng thái on-chain đã xác nhận |
| ElevenLabs | Đọc hướng dẫn hoặc cảnh báo âm thanh | Backend giữ key, kiểm quyền/quota; cache âm thanh phù hợp và xử lý autoplay |
| Firecrawl | Chuyển trang công khai được phép đọc thành Markdown | Nguồn, freshness, trang bị chặn và chi phí theo endpoint; chưa đo mức giảm context |
| Solana Mobile | Kết nối ví qua MWA trên thiết bị hỗ trợ | Kiểm wallet/OS/browser, chọn account đúng, thử flow thực; không tự bảo đảm đạt giải mobile |

### 3.2. Free Tier và thời gian tích hợp

Các số là snapshot trang pricing ngày **17/11/2026**, có thể đổi; không phải ưu đãi hackathon mặc định.

| Dịch vụ | Hạn mức có nguồn / điều chưa kiểm chứng | Thời gian tích hợp |
| --- | --- | --- |
| Supabase | Free: 500 MB DB, 50.000 MAU, 1 GB file storage, 500.000 Edge Function invocations; còn egress/Realtime và giới hạn khác. [Pricing](https://supabase.com/pricing) | **Chưa kiểm chứng**: chưa có spike đo cả Auth/RLS và xử lý lỗi |
| ElevenLabs | [API pricing theo model/plan](https://elevenlabs.io/pricing/api); **chưa kiểm chứng** quota tài khoản/model sẽ dùng. Không coi “10.000 ký tự/tháng” là mức chung cho mọi endpoint/model | **Chưa kiểm chứng**: chưa đo backend bảo vệ key, quota và playback |
| Firecrawl | Free hiển thị **1.000 credits/tháng**, 2 concurrent requests. [Pricing](https://www.firecrawl.dev/pricing); scrape cơ bản 1 credit, tùy chọn khác có thể tốn thêm theo [docs](https://docs.firecrawl.dev/features/scrape) | **Chưa kiểm chứng**: chưa thử tập nguồn thật hoặc retry/cache |
| MWA | Giao thức/SDK mã nguồn mở; không đồng nghĩa mọi chi phí thiết bị, RPC, đóng gói/phát hành app đều miễn phí. [Repository](https://github.com/solana-mobile/mobile-wallet-adapter) | **Chưa kiểm chứng**: chưa thử trên máy/wallet mục tiêu |

Bỏ ước lượng “30–60 phút”, “1–2 giờ”, “8–12 giờ” không có phép đo. Ngân sách 48h là giả định nội bộ; trang Dev3pack mô tả sự kiện ba ngày 27–29/11/2026. Đánh giá độ khó sau một spike có log và tiêu chí đạt, không dựa vào số dòng code.

### 3.3. Chọn ít tích hợp nhưng có vai trò rõ

Ví dụ **đề xuất, chưa xây**: app theo dõi thông tin công khai về một dự án Solana. Chỉ thêm Firecrawl nếu cần đọc web; Supabase nếu cần lưu lịch sử; ElevenLabs nếu người dùng cần nghe; MWA nếu có flow ví trên mobile. AI chạy off-chain, không gọi Solana program là LLM. Không đưa ra lệnh giao dịch tự động chỉ để trình diễn SDK.

Giải đã công bố: **$10.000+ Best App Overall on Solana**, **$500 local tracks** ở một số quốc gia, **Seeker Phones** cho **Best Mobile App Built on Solana Mobile**, **$2.500+ perks/sinh viên**, suất **Bridge Accelerator từ 7/12/2026**. Đây là giải/perks trên [trang chủ](https://hack.dev3pack.xyz), không phải bốn bounty SDK.

Bài nộp vẫn phải theo [001](001-hackathon-rules.md): open source, Solana, demo thật dưới 3 phút, link công khai; hai vòng Product/Technical không có trọng số công bố. Form năm bước và deadline 29/11/2026 (giờ UTC xem dashboard) ở [012](012-winning-solana-hackathons.md). Không thay điều kiện này bằng một ma trận “tiềm năng ẵm bounty”.

## 4. Ví dụ và Quy trình tối thiểu

### 4.1. Tích hợp Supabase Client & Realtime (TypeScript)

Mẫu chưa chạy trong phiên sửa. Chỉ dùng publishable/anon key ở client; bật RLS và policy đúng quyền, cấu hình Realtime cho bảng trước khi dùng. Service-role/secret key chỉ ở server; kết nối ví không tự trở thành session Auth hợp lệ. [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Lắng nghe sự kiện thay đổi điểm số người chơi thời gian thực
export function subscribeToLeaderboard(callback: (payload: any) => void) {
  return supabase
    .channel('public:leaderboard')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, callback)
    .subscribe();
}
```

### 4.2. Firecrawl REST v2 — chỉ gọi từ backend

Ví dụ **chưa chạy**, đối chiếu [Scrape docs](https://docs.firecrawl.dev/features/scrape) ngày 17/11/2026. Mẫu dùng URL nguồn cố định; khi mở cho người dùng, backend phải kiểm tra nguồn được phép và hạn mức. Không đưa secret vào browser.

```typescript
// CHỈ SERVER, Web Fetch API; không phụ thuộc API của SDK cũ chưa khóa version.
export async function fetchCleanNews(): Promise<string> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error('Chưa cấu hình Firecrawl.');
  const response = await fetch('https://api.firecrawl.dev/v2/scrape', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ url: 'https://solana.com/news', formats: ['markdown'] }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error('Firecrawl chưa trả kết quả.');
  const result = await response.json();
  const status = result.data?.metadata?.statusCode;
  if (!result.success || !(status >= 200 && status < 300 || status === 304)
      || typeof result.data?.markdown !== 'string') {
    throw new Error('Chưa lấy được nội dung nguồn hợp lệ.');
  }
  return result.data.markdown;
}
```

API thành công không tự chứng minh website nguồn trả nội dung đúng/mới; còn phải kiểm tra status của trang nguồn và nội dung thực tế. Không coi đầu ra scraping là bằng chứng xác minh danh tính hay độ uy tín dự án.

### 4.3. ElevenLabs qua backend; browser chỉ nhận audio

**Cảnh báo:** `ELEVENLABS_API_KEY` là secret, chỉ đặt trong biến môi trường server. Không dùng tiền tố public như `VITE_`/`NEXT_PUBLIC_`, không truyền key qua props, browser bundle hoặc request từ browser. [ElevenLabs Authentication](https://elevenlabs.io/docs/api-reference/authentication) yêu cầu giữ key ngoài client-side code; single-use token chỉ dùng được với những endpoint được hỗ trợ, không mặc định áp dụng cho TTS này.

Mẫu TypeScript cho backend Node có Web Fetch API, **chưa chạy hoặc triển khai**. Route `/api/voice-alert` phải nối tới handler dưới đây. `authorizeAndConsumeQuota` là dependency **do ứng dụng tự triển khai**, không phải API của ElevenLabs: xác minh session, kiểm tra origin/CSRF theo cơ chế đăng nhập và áp hạn mức nguyên tử theo user; chỉ trả `true` khi được phép. Thiếu guard thì không thể khởi tạo handler; không thay guard bằng hàm luôn trả `true`.

```typescript
// CHỈ SERVER: ví dụ server/voice-alert.ts, không import vào frontend.
type VoiceAlertGuard = (request: Request) => Promise<boolean>;

export function createVoiceAlertHandler(authorizeAndConsumeQuota: VoiceAlertGuard) {
  return async function POST(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    if (!(await authorizeAndConsumeQuota(request))) {
      return new Response('Không có quyền hoặc đã hết hạn mức.', { status: 403 });
    }
    const input = await request.json().catch(() => null);
    if (typeof input?.text !== 'string' || !input.text.trim() || input.text.length > 500) {
      return new Response('Nội dung phải có 1–500 ký tự.', { status: 400 });
    }
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    if (!apiKey || !voiceId) {
      return new Response('Dịch vụ âm thanh chưa được cấu hình.', { status: 503 });
    }
    try {
      const upstream = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
          body: JSON.stringify({ text: input.text, model_id: 'eleven_multilingual_v2' }),
          signal: AbortSignal.timeout(15_000),
        },
      );
      if (!upstream.ok || !upstream.body) {
        return new Response('Không tạo được âm thanh.', { status: 502 });
      }
      return new Response(upstream.body, {
        headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
      });
    } catch {
      return new Response('Dịch vụ âm thanh chưa phản hồi.', { status: 502 });
    }
  };
}
```

Endpoint, `model_id` và `output_format` được đối chiếu với [Create speech](https://elevenlabs.io/docs/api-reference/text-to-speech/convert), ngày 17/11/2026. Voice ID phải thuộc quyền sử dụng của tài khoản. Không chuyển tiếp header hoặc body lỗi từ upstream ra client.

```typescript
// CHỈ BROWSER: gọi route cùng origin, không nhận hoặc biết API key ElevenLabs.
export async function playVoiceAlert(text: string): Promise<void> {
  const response = await fetch('/api/voice-alert', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Không phát được thông báo âm thanh.');
  const audioUrl = URL.createObjectURL(await response.blob());
  const audio = new Audio(audioUrl);
  const release = () => URL.revokeObjectURL(audioUrl);
  audio.addEventListener('ended', release, { once: true });
  audio.addEventListener('error', release, { once: true });
  try {
    await audio.play(); // Gọi từ thao tác người dùng; browser có thể chặn autoplay.
  } catch (error) {
    release();
    throw error;
  }
}
```

Trước khi dùng thật: kiểm tra guard từ chối request chưa đăng nhập/hết quota, giới hạn kích thước request ở route/gateway, xử lý upstream timeout và xác nhận DevTools chỉ thấy `/api/voice-alert` cùng audio, không thấy key. Đây là checklist cần chạy sau, chưa phải kết quả kiểm thử.

---

## 5. Tự kiểm tra

1. Key ElevenLabs/Firecrawl đặt ở đâu? **Server environment**; browser chỉ gọi backend của ứng dụng, không chứa secret.
2. Cài bốn SDK có đủ bốn bounty? **Không**; partner track chưa công bố, cần vai trò sản phẩm thật và điều kiện cụ thể.
3. Free Tier có bảo đảm demo không hết quota? **Không**; tính request/credits, concurrency, egress và cache theo plan/model thực tế.
4. Có thể tin mẫu “tích hợp trong 30 phút” không? **Chưa kiểm chứng** nếu chưa đo môi trường và flow hoàn chỉnh.

## 6. Nguồn và độ tin cậy

- [Dev3pack trang chủ](https://hack.dev3pack.xyz), [FAQ](https://hack.dev3pack.xyz/faq) — nguồn thể lệ, kiểm tra bằng browser **17/11/2026**.
- [Supabase pricing](https://supabase.com/pricing), [JavaScript reference](https://supabase.com/docs/reference/javascript/introduction), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) — nguồn tính năng/giới hạn, không phải thể lệ giải.
- [ElevenLabs Authentication](https://elevenlabs.io/docs/api-reference/authentication), [Create speech](https://elevenlabs.io/docs/api-reference/text-to-speech/convert), [API pricing](https://elevenlabs.io/pricing/api).
- [Firecrawl Scrape](https://docs.firecrawl.dev/features/scrape), [Pricing](https://www.firecrawl.dev/pricing).
- [MWA spec](https://solana-mobile.github.io/mobile-wallet-adapter/spec/spec.html); đối chiếu type/version ở 008.

## 7. Điểm chưa kiểm chứng và bước tiếp theo

Chưa đo thời gian tích hợp, chưa chạy các snippet với dịch vụ thật, chưa kiểm quota tài khoản/model ElevenLabs và thiết bị MWA. Chưa biết partner tracks/bounty cuối cùng; kiểm tra thông báo BTC trước kickoff. Không đăng ký tài khoản, lấy key hay deploy trong phiên sửa tài liệu này.

**Bài học / lỗi đã gặp:** key của nhà cung cấp phải ở backend; tài trợ, pricing và điều kiện track là ba loại thông tin khác nhau. Ví dụ ngắn chưa chứng minh tích hợp đã an toàn hoặc đã hoạt động.
