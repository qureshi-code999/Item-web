using System;
using System.IO;
using System.Threading.Tasks;
using Windows.Graphics.Imaging;
using Windows.Media.Ocr;
using Windows.Storage;
using Windows.Storage.Streams;

public class OcrProgram {
    public static void Main(string[] args) {
        if (args.Length < 1) {
            Console.WriteLine("Usage: ocr_tool.exe <image_path>");
            return;
        }
        try {
            var lines = RecognizeAsync(args[0]).GetAwaiter().GetResult();
            foreach (var line in lines) {
                Console.WriteLine(line);
            }
        } catch (Exception ex) {
            Console.Error.WriteLine("Error: " + ex.Message);
        }
    }

    private static async Task<string[]> RecognizeAsync(string imagePath) {
        StorageFile file = await System.WindowsRuntimeSystemExtensions.AsTask(StorageFile.GetFileFromPathAsync(imagePath));
        using (IRandomAccessStream stream = await System.WindowsRuntimeSystemExtensions.AsTask(file.OpenAsync(FileAccessMode.Read))) {
            BitmapDecoder decoder = await System.WindowsRuntimeSystemExtensions.AsTask(BitmapDecoder.CreateAsync(stream));
            using (SoftwareBitmap bitmap = await System.WindowsRuntimeSystemExtensions.AsTask(decoder.GetSoftwareBitmapAsync())) {
                OcrEngine engine = OcrEngine.TryCreateFromUserProfileLanguages();
                if (engine == null) {
                    engine = OcrEngine.TryCreateFromLanguage(new Windows.Globalization.Language("en-US"));
                }
                OcrResult result = await System.WindowsRuntimeSystemExtensions.AsTask(engine.RecognizeAsync(bitmap));
                string[] lines = new string[result.Lines.Count];
                for (int i = 0; i < result.Lines.Count; i++) {
                    lines[i] = result.Lines[i].Text;
                }
                return lines;
            }
        }
    }
}
