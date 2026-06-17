export default function Newsletter() {
  return (
    <section className="bg-sand">
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="font-label text-xs tracking-[0.2em] uppercase text-muted mb-3">
          Stay Inspired
        </p>
        <h2 className="font-display text-display-lg mb-4">
          Join our mailing list
        </h2>
        <p className="text-muted max-w-md mx-auto mb-8 leading-relaxed">
          Subscribe to receive updates on new posts, exclusive offers, and special content just for you.
        </p>

        <form className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder="Your email address"
            required
            className="flex-1 border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-accent placeholder:text-muted"
          />
          <button
            type="submit"
            className="bg-foreground text-background px-6 py-3 font-label text-xs tracking-widest uppercase hover:bg-accent transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}
