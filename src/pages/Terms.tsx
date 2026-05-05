export default function Terms() {
  return (
    <div className="bg-stone-50 min-h-screen py-24 px-6">
      <div className="mx-auto max-w-3xl bg-white p-8 md:p-16 rounded-[3rem] border border-stone-200 shadow-sm">
        <h1 className="text-4xl font-bold mb-8 tracking-tight">Terms of Service</h1>
        <div className="prose prose-stone max-w-none space-y-6 text-stone-600">
          <p>Welcome to DraftMeter. By using our website, you agree to comply with and be bound by the following terms and conditions.</p>
          
          <section>
            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">1. Use License</h2>
            <p>Permission is granted to use DraftMeter for personal or commercial writing evaluation. You may not attempt to decompile or reverse engineer any software contained on DraftMeter's website.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">2. Disclaimer</h2>
            <p>The materials on DraftMeter's website are provided on an 'as is' basis. DraftMeter makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">3. Accuracy of AI Analysis</h2>
            <p>AI-generated critiques are for informational purposes only. While we strive for accuracy, DraftMeter is not responsible for any outcomes resulting from following AI-suggested refinements.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">4. Limitations</h2>
            <p>In no event shall DraftMeter or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials on DraftMeter's website.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
