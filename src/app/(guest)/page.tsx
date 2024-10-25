import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { desc } from "drizzle-orm";
import { postTable } from "@/drizzle/schema";
import db from "@/drizzle";

export default async function Home() {
  const posts = await db.query.postTable.findMany({
    orderBy: [desc(postTable.id)],
  });
  return (
    <>
      <main className="container mx-auto mt-16 flex flex-col items-center justify-between md:flex-row">
        <div className="text-center md:text-left">
          <h1 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">
            Selamat Datang di Platform Prakerin
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Temukan pengalaman prakerin terbaik untuk mengembangkan keterampilan
            dan karir Anda.
          </p>
          <Button asChild size="lg">
            <Link href="/signup">Mulai Sekarang</Link>
          </Button>
        </div>
        <div className="mt-12 md:mt-0">
          <Image
            src="/images/hero-image.webp"
            alt="Ilustrasi Prakerin"
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </main>

      <section className="mt-24 py-16">
        <div className="container mx-auto">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
            Postingan Terbaru
          </h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post.id} className="rounded-lg bg-white p-6 shadow">
                  <h3 className="mb-4 text-xl font-semibold">{post.title}</h3>
                  <p className="mb-4 text-gray-600">{post.excerpt}</p>
                  <Link
                    href={`/post/${post.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    Baca selengkapnya
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              Belum ada postingan saat ini. Silakan kembali lagi nanti.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
