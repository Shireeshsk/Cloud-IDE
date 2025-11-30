import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirCodes = path.join(__dirname, "../temp-code");
if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

// Helper: clean error messages
function cleanErrorMsg(msg) {
    if (!msg) return "";
    return msg
        .replace(/^\s*File\s+"[^"]+",\s*/gm, "")
        .replace(
            /([A-Z]:)?[\\\/][\w\\\/. -]*\b([\w\d_-]+\.(cpp|c|h|hpp|java|js|py|go|rs|rb|php|cs|swift|kt))\b:/gi,
            "$2:"
        )
        .trim();
}

// Language container configs - EXPANDED!
const DOCKER_CONFIG = {
    // JavaScript & TypeScript
    js: {
        image: "node:20-alpine",
        runCmd: (file) => `node ${file}`,
        ext: "js"
    },
    javascript: {
        image: "node:20-alpine",
        runCmd: (file) => `node ${file}`,
        ext: "js"
    },
    jsx: {
        image: "node:20-alpine",
        runCmd: (file) => `node ${file}`,
        ext: "js"
    },
    ts: {
        image: "node:20-alpine",
        runCmd: (file) => `npx ts-node ${file}`,
        ext: "ts"
    },
    typescript: {
        image: "node:20-alpine",
        runCmd: (file) => `npx ts-node ${file}`,
        ext: "ts"
    },

    // Python
    py: {
        image: "python:3.11-alpine",
        runCmd: (file) => `python ${file}`,
        ext: "py"
    },
    python: {
        image: "python:3.11-alpine",
        runCmd: (file) => `python ${file}`,
        ext: "py"
    },

    // Java
    java: {
        image: "eclipse-temurin:17-jdk-alpine",
        runCmd: (file) => {
            const className = path.basename(file, ".java");
            return `sh -c "javac ${file} && java ${className}"`;
        },
        ext: "java"
    },

    // C & C++
    c: {
        image: "gcc:latest",
        runCmd: (file) => {
            const bin = path.basename(file, ".c");
            return `sh -c "gcc ${file} -o ${bin} && ./${bin}"`;
        },
        ext: "c"
    },
    cpp: {
        image: "gcc:latest",
        runCmd: (file) => {
            const bin = path.basename(file, ".cpp");
            return `sh -c "g++ ${file} -o ${bin} && ./${bin}"`;
        },
        ext: "cpp"
    },

    // Go
    go: {
        image: "golang:1.21-alpine",
        runCmd: (file) => `go run ${file}`,
        ext: "go"
    },
    golang: {
        image: "golang:1.21-alpine",
        runCmd: (file) => `go run ${file}`,
        ext: "go"
    },

    // Rust
    rs: {
        image: "rust:1.75-alpine",
        runCmd: (file) => {
            const bin = path.basename(file, ".rs");
            return `sh -c "rustc ${file} -o ${bin} && ./${bin}"`;
        },
        ext: "rs"
    },
    rust: {
        image: "rust:1.75-alpine",
        runCmd: (file) => {
            const bin = path.basename(file, ".rs");
            return `sh -c "rustc ${file} -o ${bin} && ./${bin}"`;
        },
        ext: "rs"
    },

    // Ruby
    rb: {
        image: "ruby:3.2-alpine",
        runCmd: (file) => `ruby ${file}`,
        ext: "rb"
    },
    ruby: {
        image: "ruby:3.2-alpine",
        runCmd: (file) => `ruby ${file}`,
        ext: "rb"
    },

    // PHP
    php: {
        image: "php:8.2-cli-alpine",
        runCmd: (file) => `php ${file}`,
        ext: "php"
    },

    // C#
    cs: {
        image: "mcr.microsoft.com/dotnet/sdk:8.0-alpine",
        runCmd: (file) => `dotnet script ${file}`,
        ext: "cs"
    },
    csharp: {
        image: "mcr.microsoft.com/dotnet/sdk:8.0-alpine",
        runCmd: (file) => `dotnet script ${file}`,
        ext: "cs"
    },

    // Swift
    swift: {
        image: "swift:5.9",
        runCmd: (file) => `swift ${file}`,
        ext: "swift"
    },

    // Kotlin
    kt: {
        image: "zenika/kotlin:1.9-jdk17-alpine",
        runCmd: (file) => `kotlinc ${file} -include-runtime -d output.jar && java -jar output.jar`,
        ext: "kt"
    },
    kotlin: {
        image: "zenika/kotlin:1.9-jdk17-alpine",
        runCmd: (file) => `kotlinc ${file} -include-runtime -d output.jar && java -jar output.jar`,
        ext: "kt"
    },

    // Perl
    pl: {
        image: "perl:5.38-alpine",
        runCmd: (file) => `perl ${file}`,
        ext: "pl"
    },
    perl: {
        image: "perl:5.38-alpine",
        runCmd: (file) => `perl ${file}`,
        ext: "pl"
    },

    // R
    r: {
        image: "r-base:latest",
        runCmd: (file) => `Rscript ${file}`,
        ext: "r"
    },

    // Scala
    scala: {
        image: "hseeberger/scala-sbt:11.0.16.1_1.8.2_2.13.10",
        runCmd: (file) => `scala ${file}`,
        ext: "scala"
    },

    // Lua
    lua: {
        image: "nickblah/lua:5.4-alpine",
        runCmd: (file) => `lua ${file}`,
        ext: "lua"
    },

    // Bash/Shell
    sh: {
        image: "bash:latest",
        runCmd: (file) => `bash ${file}`,
        ext: "sh"
    },
    bash: {
        image: "bash:latest",
        runCmd: (file) => `bash ${file}`,
        ext: "sh"
    },
};

// Extract Java class name
function extractJavaFileName(javaCode) {
    const code = javaCode.trim();
    const publicPatterns = [
        /public\s+class\s+(\w+)/,
        /public\s+interface\s+(\w+)/,
        /public\s+enum\s+(\w+)/,
    ];
    for (const pattern of publicPatterns) {
        const match = code.match(pattern);
        if (match) return match[1];
    }
    const generalPatterns = [
        /class\s+(\w+)/,
        /interface\s+(\w+)/,
        /enum\s+(\w+)/,
    ];
    for (const pattern of generalPatterns) {
        const match = code.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Generate temp file
async function generateFile(format, code) {
    let className = null;
    if (format.toLowerCase() === "java") {
        className = extractJavaFileName(code);
    }

    const filename = className ? `${className}.${format}` : `${uuid()}.${format}`;
    const filepath = path.join(dirCodes, filename);

    await fs.promises.writeFile(filepath, code);
    return filepath;
}

// Execute code in Docker
async function executeInDocker(language, filepath) {
    return new Promise((resolve, reject) => {
        const absPath = path.resolve(filepath);
        const hostDir = path.dirname(absPath).replace(/\\/g, "/");
        const fileName = path.basename(absPath);

        const langConfig = DOCKER_CONFIG[language];
        if (!langConfig) {
            return reject(`Unsupported language: ${language}`);
        }

        const cmd = `docker run --rm --network none --memory=256m --cpus=0.5 --pids-limit=64 -v "${hostDir}:/app" -w /app ${langConfig.image} ${langConfig.runCmd(fileName)}`;

        console.log("🐳 Running code in Docker for language:", language);

        exec(cmd, { timeout: 15000, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
            // Clean up temp file
            fs.unlink(filepath, (err) => {
                if (err) console.error("Error deleting temp file:", err);
            });

            if (error) {
                if (error.killed) {
                    return reject("⏱️ Execution Timeout: Possible infinite loop or long-running code");
                }
                const errMsg = cleanErrorMsg(stderr || error.message);
                return reject(`❌ Runtime Error: ${errMsg}`);
            }

            if (stdout && stdout.trim().length > 0) {
                resolve(stdout.trim());
            } else if (stderr && stderr.trim().length > 0) {
                resolve(stderr.trim());
            } else {
                resolve("[No output]");
            }
        });
    });
}

// Main controller
export const executeCode = async (req, res) => {
    try {
        const { code, language } = req.body;
        const userId = req.user._id;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required",
            });
        }

        // Map file extensions to language
        const langMap = {
            js: "js",
            jsx: "jsx",
            ts: "ts",
            tsx: "ts",
            py: "py",
            python: "py",
            java: "java",
            cpp: "cpp",
            c: "c",
            go: "go",
            golang: "go",
            rs: "rs",
            rust: "rs",
            rb: "rb",
            ruby: "rb",
            php: "php",
            cs: "cs",
            csharp: "cs",
            swift: "swift",
            kt: "kt",
            kotlin: "kt",
            pl: "pl",
            perl: "pl",
            r: "r",
            scala: "scala",
            lua: "lua",
            sh: "sh",
            bash: "bash",
        };

        const execLang = langMap[language.toLowerCase()] || language.toLowerCase();

        if (!DOCKER_CONFIG[execLang]) {
            return res.status(400).json({
                success: false,
                message: `Unsupported language: ${language}. Supported: JavaScript, TypeScript, Python, Java, C, C++, Go, Rust, Ruby, PHP, C#, Swift, Kotlin, Perl, R, Scala, Lua, Bash`,
            });
        }

        console.log(`📝 Executing ${execLang} code for user ${userId}`);

        // Generate temp file
        const filepath = await generateFile(DOCKER_CONFIG[execLang].ext, code);

        // Execute in Docker
        const output = await executeInDocker(execLang, filepath);

        res.status(200).json({
            success: true,
            output,
            language: execLang,
        });
    } catch (error) {
        console.error("Error executing code:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error executing code",
            output: error.toString(),
        });
    }
};
