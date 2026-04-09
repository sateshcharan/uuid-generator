import { useState, useEffect, useRef } from "react";
import { v1 as uuidv1, v4 as uuidv4, v5 as uuidv5, validate, version as uuidVersion } from "uuid";
import { Copy, RefreshCw, Check, Download, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";

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
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
              U
            </div>
            <span className="font-semibold text-lg tracking-tight">UUID Generator</span>
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
          <TabsList className="w-full md:w-auto flex overflow-x-auto justify-start border-b rounded-none bg-transparent p-0 pb-1 mb-6 gap-6">
            <TabsTrigger
              value="v4"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 py-2 font-medium"
              data-testid="tab-v4"
            >
              UUID v4 (Random)
            </TabsTrigger>
            <TabsTrigger
              value="v1"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 py-2 font-medium"
              data-testid="tab-v1"
            >
              UUID v1 (Time)
            </TabsTrigger>
            <TabsTrigger
              value="v5"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 py-2 font-medium"
              data-testid="tab-v5"
            >
              UUID v5 (Name)
            </TabsTrigger>
            <TabsTrigger
              value="bulk"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 py-2 font-medium"
              data-testid="tab-bulk"
            >
              Bulk Generate
            </TabsTrigger>
            <TabsTrigger
              value="validate"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 py-2 font-medium"
              data-testid="tab-validate"
            >
              Validate
            </TabsTrigger>
          </TabsList>

          <div className="bg-card border rounded-lg p-6 md:p-8 shadow-sm">
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
          </div>
        </Tabs>
      </main>
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

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="flex flex-col items-center py-6">
      <CardDescription className="mb-8 text-center text-base">
        A version 4 UUID is randomly generated. This is the most common type of UUID.
      </CardDescription>

      <div
        className="w-full text-center p-8 bg-muted/30 border border-border/50 rounded-xl mb-8 cursor-pointer hover:bg-muted/50 transition-colors group"
        onClick={() => handleCopy(formatUuid(uuid), "v4")}
        data-testid="text-uuid-v4"
        title="Click to copy"
      >
        <div className="font-mono text-2xl md:text-4xl tracking-wider text-primary break-all group-hover:scale-[1.02] transition-transform">
          {formatUuid(uuid)}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="lg"
          onClick={generate}
          data-testid="button-regenerate-v4"
          className="gap-2"
        >
          <RefreshCw className={`w-5 h-5 ${isRotating ? "animate-spin" : ""}`} />
          Generate New
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => handleCopy(formatUuid(uuid), "v4")}
          data-testid="button-copy-v4"
          className="gap-2"
        >
          {copiedMap["v4"] ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
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

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="flex flex-col items-center py-6">
      <CardDescription className="mb-8 text-center text-base">
        A version 1 UUID is generated using a timestamp and the MAC address of the computer on which it was generated.
      </CardDescription>

      <div
        className="w-full text-center p-8 bg-muted/30 border border-border/50 rounded-xl mb-8 cursor-pointer hover:bg-muted/50 transition-colors group"
        onClick={() => handleCopy(formatUuid(uuid), "v1")}
        data-testid="text-uuid-v1"
        title="Click to copy"
      >
        <div className="font-mono text-2xl md:text-4xl tracking-wider text-primary break-all group-hover:scale-[1.02] transition-transform">
          {formatUuid(uuid)}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="lg"
          onClick={generate}
          data-testid="button-regenerate-v1"
          className="gap-2"
        >
          <RefreshCw className={`w-5 h-5 ${isRotating ? "animate-spin" : ""}`} />
          Generate New
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => handleCopy(formatUuid(uuid), "v1")}
          data-testid="button-copy-v1"
          className="gap-2"
        >
          {copiedMap["v1"] ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
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
    } catch (e) {
      setUuid("");
    }
  };

  useEffect(() => {
    generate();
  }, [namespaceType, nameInput]);

  return (
    <div className="flex flex-col py-6">
      <CardDescription className="mb-8 text-center text-base">
        A version 5 UUID is generated by hashing a namespace identifier and a name. It produces the same UUID for the same inputs.
      </CardDescription>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <Label htmlFor="namespace">Namespace</Label>
          <Select value={namespaceType} onValueChange={(val) => setNamespaceType(val as any)}>
            <SelectTrigger id="namespace" data-testid="select-namespace">
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
          <Label htmlFor="name-input">Name</Label>
          <Input
            id="name-input"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter a name or value"
            data-testid="input-v5-name"
          />
        </div>
      </div>

      {uuid ? (
        <div className="flex flex-col items-center">
          <div
            className="w-full text-center p-8 bg-muted/30 border border-border/50 rounded-xl mb-8 cursor-pointer hover:bg-muted/50 transition-colors group"
            onClick={() => handleCopy(formatUuid(uuid), "v5")}
            data-testid="text-uuid-v5"
            title="Click to copy"
          >
            <div className="font-mono text-2xl md:text-4xl tracking-wider text-primary break-all group-hover:scale-[1.02] transition-transform">
              {formatUuid(uuid)}
            </div>
          </div>
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleCopy(formatUuid(uuid), "v5")}
            data-testid="button-copy-v5"
            className="gap-2"
          >
            {copiedMap["v5"] ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            {copiedMap["v5"] ? "Copied!" : "Copy"}
          </Button>
        </div>
      ) : (
        <div className="w-full text-center p-8 bg-muted/10 border border-border border-dashed rounded-xl text-muted-foreground flex flex-col items-center gap-2">
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

  useEffect(() => {
    generate();
  }, []);

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
      <div className="flex flex-col md:flex-row items-end md:items-center gap-4 mb-6 bg-muted/30 p-4 rounded-lg border border-border/50">
        <div className="space-y-2 w-full md:w-32">
          <Label htmlFor="bulk-count">Quantity</Label>
          <Input
            id="bulk-count"
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            data-testid="input-bulk-count"
          />
        </div>
        <div className="space-y-2 w-full md:w-48">
          <Label htmlFor="bulk-version">Version</Label>
          <Select value={version} onValueChange={setVersion}>
            <SelectTrigger id="bulk-version" data-testid="select-bulk-version">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v4">UUID v4 (Random)</SelectItem>
              <SelectItem value="v1">UUID v1 (Time)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={generate}
          data-testid="button-bulk-generate"
          className="w-full md:w-auto md:ml-auto gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRotating ? "animate-spin" : ""}`} />
          Generate Bulk
        </Button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground font-medium">
          Generated {uuids.length} UUIDs
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={downloadTxt}
            data-testid="button-bulk-download"
            className="h-8 gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Save .txt
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleCopy(uuidsText, "bulk")}
            data-testid="button-bulk-copy"
            className="h-8 gap-1.5"
          >
            {copiedMap["bulk"] ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedMap["bulk"] ? "Copied All!" : "Copy All"}
          </Button>
        </div>
      </div>

      <Textarea
        value={uuidsText}
        readOnly
        className="font-mono text-sm h-[300px] resize-y bg-muted/10 border-muted"
        data-testid="textarea-bulk-uuids"
      />
    </div>
  );
}

function ValidateSection() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ isValid: boolean; version?: number } | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }

    const cleanInput = input.trim();
    const isValid = validate(cleanInput);
    
    if (isValid) {
      setResult({ isValid: true, version: uuidVersion(cleanInput) });
    } else {
      setResult({ isValid: false });
    }
  }, [input]);

  return (
    <div className="flex flex-col py-2">
      <CardDescription className="mb-6 text-base">
        Paste a UUID below to check if it's valid and determine its version.
      </CardDescription>

      <div className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
          className="font-mono text-lg h-[120px] resize-none"
          data-testid="textarea-validate-input"
        />

        <div className="h-20 flex items-center justify-center border rounded-lg bg-muted/10">
          {!input.trim() ? (
            <span className="text-muted-foreground">Awaiting input...</span>
          ) : result?.isValid ? (
            <Badge className="bg-green-500 hover:bg-green-600 text-white text-base py-2 px-4 flex items-center gap-2">
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
