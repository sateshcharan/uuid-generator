import { useState, useEffect } from "react";
import { v1 as uuidv1, v4 as uuidv4, v5 as uuidv5, validate, version as uuidVersion } from "uuid";
import { Copy, RefreshCw, Check, Download, Info, ExternalLink, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";

type Format = "lowercase" | "uppercase";

export default function Home() {
  const [activeTab, setActiveTab] = useState("v4");
  const [format, setFormat] = useState<Format>("lowercase");
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  const formatUuid = (uuid: string) => (format === "uppercase" ? uuid.toUpperCase() : uuid);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 dark:from-blue-900 dark:via-blue-800 dark:to-indigo-900 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg shadow-inner">
              U
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">UUID Generator</span>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Generate & Validate UUIDs</h1>
            <p className="text-muted-foreground mt-1">
              A fast, client-side utility for working with Universally Unique Identifiers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="uppercase-switch" className="text-sm font-medium">Uppercase</Label>
            <Switch
              id="uppercase-switch"
              checked={format === "uppercase"}
              onCheckedChange={(checked) => setFormat(checked ? "uppercase" : "lowercase")}
              data-testid="switch-uppercase"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex overflow-x-auto justify-start border-b rounded-none bg-transparent p-0 pb-1 mb-6 gap-1">
            <TabsTrigger
              value="v4"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 font-medium text-sm"
              data-testid="tab-v4"
            >
              UUID v4 (Random)
            </TabsTrigger>
            <TabsTrigger
              value="v1"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 font-medium text-sm"
              data-testid="tab-v1"
            >
              UUID v1 (Time)
            </TabsTrigger>
            <TabsTrigger
              value="v5"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 font-medium text-sm"
              data-testid="tab-v5"
            >
              UUID v5 (Name)
            </TabsTrigger>
            <TabsTrigger
              value="bulk"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 font-medium text-sm"
              data-testid="tab-bulk"
            >
              Bulk Generate
            </TabsTrigger>
            <TabsTrigger
              value="validate"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-rose-500 data-[state=active]:text-rose-600 dark:data-[state=active]:text-rose-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 font-medium text-sm"
              data-testid="tab-validate"
            >
              Validate
            </TabsTrigger>
          </TabsList>

          <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
            <TabsContent value="v4" className="mt-0 outline-none">
              <V4Section format={format} handleCopy={handleCopy} copiedMap={copiedMap} formatUuid={formatUuid} />
            </TabsContent>

            <TabsContent value="v1" className="mt-0 outline-none">
              <V1Section format={format} handleCopy={handleCopy} copiedMap={copiedMap} formatUuid={formatUuid} />
            </TabsContent>

            <TabsContent value="v5" className="mt-0 outline-none">
              <V5Section format={format} handleCopy={handleCopy} copiedMap={copiedMap} formatUuid={formatUuid} />
            </TabsContent>

            <TabsContent value="bulk" className="mt-0 outline-none">
              <BulkSection format={format} handleCopy={handleCopy} copiedMap={copiedMap} formatUuid={formatUuid} />
            </TabsContent>

            <TabsContent value="validate" className="mt-0 outline-none">
              <ValidateSection />
            </TabsContent>

            <Disclaimer />
          </div>
        </Tabs>
      </main>

      <footer className="border-t bg-card mt-4">
        <div className="container mx-auto px-4 py-4 max-w-4xl text-center text-xs text-muted-foreground">
          Copyright &copy; {new Date().getFullYear()} TransparenTech LLC. All Rights Reserved.{" "}
          <a href="#" className="underline underline-offset-2 hover:text-foreground transition-colors">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="mt-8 pt-6 border-t border-dashed border-border/60">
      <div className="flex items-start gap-2 mb-3">
        <ShieldCheck className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          The UUIDs generated by this site are provided <strong>AS IS</strong> without warranty of any kind, not even
          the warranty that the generated UUIDs are actually unique. You are responsible for using the UUIDs and assume
          any risk inherent to using them. You are not permitted to use the UUIDs generated by this site if you do not
          agree to these terms. Do not use any UUIDs found on cached versions of this page.
        </p>
      </div>
      <div className="flex items-start gap-2 mb-3">
        <p className="text-xs text-muted-foreground leading-relaxed pl-6">
          The UUIDs generated by this site conform to{" "}
          <a
            href="https://www.ietf.org/rfc/rfc4122.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400 hover:underline"
          >
            RFC 4122 <ExternalLink className="w-3 h-3" />
          </a>{" "}
          whenever possible.{" "}
          <a
            href="https://en.wikipedia.org/wiki/Universally_unique_identifier"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Read more about UUIDs at Wikipedia <ExternalLink className="w-3 h-3" />
          </a>
          .
        </p>
      </div>
      <div className="pl-6 flex flex-wrap gap-4 text-xs">
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
          Privacy Policy
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
          Developer API
        </a>
      </div>
      <p className="pl-6 mt-3 text-xs text-muted-foreground/70">
        This website uses cookies. We use cookies to personalise content/ads and to analyse our traffic.
      </p>
    </div>
  );
}

function UuidDisplay({
  uuid,
  colorClass,
  borderClass,
  bgClass,
  onCopy,
  testId,
}: {
  uuid: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  onCopy: () => void;
  testId: string;
}) {
  return (
    <div
      className={`w-full text-center p-8 border rounded-xl mb-8 cursor-pointer transition-all duration-150 group border-l-4 ${borderClass} ${bgClass} hover:opacity-90`}
      onClick={onCopy}
      data-testid={testId}
      title="Click to copy"
    >
      <div className={`font-mono text-2xl md:text-4xl tracking-wider break-all group-hover:scale-[1.01] transition-transform ${colorClass}`}>
        {uuid}
      </div>
    </div>
  );
}

function V4Section({ format, handleCopy, copiedMap, formatUuid }: any) {
  const [uuid, setUuid] = useState("");
  const [isRotating, setIsRotating] = useState(false);

  const generate = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 300);
    setUuid(uuidv4());
  };

  useEffect(() => { generate(); }, []);

  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex items-center gap-2 mb-6">
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100">
          Version 4
        </Badge>
        <CardDescription className="text-center text-sm">
          Randomly generated. The most common UUID type.
        </CardDescription>
      </div>

      <UuidDisplay
        uuid={formatUuid(uuid)}
        colorClass="text-blue-600 dark:text-blue-400"
        borderClass="border-l-blue-500"
        bgClass="bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
        onCopy={() => handleCopy(formatUuid(uuid), "v4")}
        testId="text-uuid-v4"
      />

      <div className="flex items-center gap-4">
        <Button size="lg" onClick={generate} data-testid="button-regenerate-v4" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0">
          <RefreshCw className={`w-5 h-5 ${isRotating ? "animate-spin" : ""}`} />
          Generate New
        </Button>
        <Button size="lg" variant="outline" onClick={() => handleCopy(formatUuid(uuid), "v4")} data-testid="button-copy-v4" className="gap-2 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40">
          {copiedMap["v4"] ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          {copiedMap["v4"] ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}

function V1Section({ format, handleCopy, copiedMap, formatUuid }: any) {
  const [uuid, setUuid] = useState("");
  const [isRotating, setIsRotating] = useState(false);

  const generate = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 300);
    setUuid(uuidv1());
  };

  useEffect(() => { generate(); }, []);

  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex items-center gap-2 mb-6">
        <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-100">
          Version 1
        </Badge>
        <CardDescription className="text-center text-sm">
          Time-based. Encodes a timestamp and MAC address.
        </CardDescription>
      </div>

      <UuidDisplay
        uuid={formatUuid(uuid)}
        colorClass="text-violet-600 dark:text-violet-400"
        borderClass="border-l-violet-500"
        bgClass="bg-violet-50/60 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800"
        onCopy={() => handleCopy(formatUuid(uuid), "v1")}
        testId="text-uuid-v1"
      />

      <div className="flex items-center gap-4">
        <Button size="lg" onClick={generate} data-testid="button-regenerate-v1" className="gap-2 bg-violet-600 hover:bg-violet-700 text-white border-0">
          <RefreshCw className={`w-5 h-5 ${isRotating ? "animate-spin" : ""}`} />
          Generate New
        </Button>
        <Button size="lg" variant="outline" onClick={() => handleCopy(formatUuid(uuid), "v1")} data-testid="button-copy-v1" className="gap-2 border-violet-300 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-950/40">
          {copiedMap["v1"] ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-violet-600 dark:text-violet-400" />}
          {copiedMap["v1"] ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}

function V5Section({ format, handleCopy, copiedMap, formatUuid }: any) {
  const namespaces = {
    DNS: uuidv5.DNS,
    URL: uuidv5.URL,
    OID: uuidv5.OID,
    X500: uuidv5.X500,
  };

  const [namespaceType, setNamespaceType] = useState<keyof typeof namespaces>("URL");
  const [nameInput, setNameInput] = useState("example.com");
  const [uuid, setUuid] = useState("");

  const generate = () => {
    try {
      if (nameInput.trim()) {
        setUuid(uuidv5(nameInput, namespaces[namespaceType]));
      } else {
        setUuid("");
      }
    } catch {
      setUuid("");
    }
  };

  useEffect(() => { generate(); }, [namespaceType, nameInput]);

  return (
    <div className="flex flex-col py-4">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100">
          Version 5
        </Badge>
        <CardDescription className="text-center text-sm">
          Name-based (SHA-1 hash). Same inputs always produce the same UUID.
        </CardDescription>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
        <div className="space-y-2">
          <Label htmlFor="namespace" className="text-emerald-700 dark:text-emerald-400 font-medium text-xs uppercase tracking-wide">Namespace</Label>
          <Select value={namespaceType} onValueChange={(val) => setNamespaceType(val as any)}>
            <SelectTrigger id="namespace" data-testid="select-namespace" className="border-emerald-300 dark:border-emerald-700">
              <SelectValue placeholder="Select namespace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DNS">DNS</SelectItem>
              <SelectItem value="URL">URL</SelectItem>
              <SelectItem value="OID">OID</SelectItem>
              <SelectItem value="X500">X500</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name-input" className="text-emerald-700 dark:text-emerald-400 font-medium text-xs uppercase tracking-wide">Name</Label>
          <Input
            id="name-input"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter a name or value"
            data-testid="input-v5-name"
            className="border-emerald-300 dark:border-emerald-700"
          />
        </div>
      </div>

      {uuid ? (
        <div className="flex flex-col items-center">
          <UuidDisplay
            uuid={formatUuid(uuid)}
            colorClass="text-emerald-600 dark:text-emerald-400"
            borderClass="border-l-emerald-500"
            bgClass="bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
            onCopy={() => handleCopy(formatUuid(uuid), "v5")}
            testId="text-uuid-v5"
          />
          <Button size="lg" variant="outline" onClick={() => handleCopy(formatUuid(uuid), "v5")} data-testid="button-copy-v5" className="gap-2 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">
            {copiedMap["v5"] ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            {copiedMap["v5"] ? "Copied!" : "Copy"}
          </Button>
        </div>
      ) : (
        <div className="w-full text-center p-8 bg-muted/10 border border-dashed rounded-xl text-muted-foreground flex flex-col items-center gap-2">
          <Info className="w-6 h-6" />
          <p>Enter a name to generate a UUID v5</p>
        </div>
      )}
    </div>
  );
}

function BulkSection({ format, handleCopy, copiedMap, formatUuid }: any) {
  const [count, setCount] = useState(10);
  const [version, setVersion] = useState("v4");
  const [uuids, setUuids] = useState<string[]>([]);
  const [isRotating, setIsRotating] = useState(false);

  const generate = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 300);
    const num = Math.min(Math.max(1, count), 500);
    const newUuids = Array.from({ length: num }).map(() => (version === "v1" ? uuidv1() : uuidv4()));
    setUuids(newUuids);
  };

  useEffect(() => { generate(); }, []);

  const formattedUuids = uuids.map(formatUuid);
  const uuidsText = formattedUuids.join("\n");

  const downloadTxt = () => {
    const blob = new Blob([uuidsText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uuids-${count}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col py-2">
      <div className="flex items-center gap-2 mb-5 justify-center">
        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100">
          Bulk
        </Badge>
        <CardDescription className="text-sm">Generate up to 500 UUIDs at once.</CardDescription>
      </div>

      <div className="flex flex-col md:flex-row items-end md:items-center gap-4 mb-5 bg-amber-50/60 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <div className="space-y-2 w-full md:w-32">
          <Label htmlFor="bulk-count" className="text-amber-700 dark:text-amber-400 font-medium text-xs uppercase tracking-wide">Quantity</Label>
          <Input id="bulk-count" type="number" min={1} max={500} value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} data-testid="input-bulk-count" className="border-amber-300 dark:border-amber-700" />
        </div>
        <div className="space-y-2 w-full md:w-48">
          <Label htmlFor="bulk-version" className="text-amber-700 dark:text-amber-400 font-medium text-xs uppercase tracking-wide">Version</Label>
          <Select value={version} onValueChange={setVersion}>
            <SelectTrigger id="bulk-version" data-testid="select-bulk-version" className="border-amber-300 dark:border-amber-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v4">UUID v4 (Random)</SelectItem>
              <SelectItem value="v1">UUID v1 (Time)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={generate} data-testid="button-bulk-generate" className="w-full md:w-auto md:ml-auto gap-2 bg-amber-500 hover:bg-amber-600 text-white border-0">
          <RefreshCw className={`w-4 h-4 ${isRotating ? "animate-spin" : ""}`} />
          Generate Bulk
        </Button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground font-medium">
          Generated <span className="text-amber-600 dark:text-amber-400 font-semibold">{uuids.length}</span> UUIDs
        </span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={downloadTxt} data-testid="button-bulk-download" className="h-8 gap-1.5 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40">
            <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Save .txt
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleCopy(uuidsText, "bulk")} data-testid="button-bulk-copy" className="h-8 gap-1.5 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40">
            {copiedMap["bulk"] ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
            {copiedMap["bulk"] ? "Copied All!" : "Copy All"}
          </Button>
        </div>
      </div>

      <Textarea value={uuidsText} readOnly className="font-mono text-sm h-[300px] resize-y bg-amber-50/30 dark:bg-amber-950/10 border-amber-200 dark:border-amber-800" data-testid="textarea-bulk-uuids" />
    </div>
  );
}

function ValidateSection() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ isValid: boolean; version?: number } | null>(null);

  useEffect(() => {
    if (!input.trim()) { setResult(null); return; }
    const cleanInput = input.trim();
    const isValid = validate(cleanInput);
    setResult(isValid ? { isValid: true, version: uuidVersion(cleanInput) } : { isValid: false });
  }, [input]);

  const versionColors: Record<number, string> = {
    1: "bg-violet-500 hover:bg-violet-600",
    4: "bg-blue-500 hover:bg-blue-600",
    5: "bg-emerald-500 hover:bg-emerald-600",
  };

  return (
    <div className="flex flex-col py-2">
      <div className="flex items-center gap-2 mb-5 justify-center">
        <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100">
          Validate
        </Badge>
        <CardDescription className="text-sm">
          Paste a UUID to check if it's valid and determine its version.
        </CardDescription>
      </div>

      <div className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
          className="font-mono text-lg h-[120px] resize-none border-rose-200 dark:border-rose-800 focus-visible:ring-rose-400"
          data-testid="textarea-validate-input"
        />

        <div className="h-20 flex items-center justify-center border rounded-lg bg-muted/10">
          {!input.trim() ? (
            <span className="text-muted-foreground text-sm">Awaiting input...</span>
          ) : result?.isValid ? (
            <Badge
              className={`${versionColors[result.version ?? 0] ?? "bg-green-500 hover:bg-green-600"} text-white text-base py-2 px-4 flex items-center gap-2`}
            >
              <Check className="w-5 h-5" />
              Valid UUID version {result.version}
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-base py-2 px-4 flex items-center gap-2">
              Invalid UUID
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
