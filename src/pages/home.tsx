import { useState, useEffect, useRef, useCallback } from "react"
import "./App.css"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "./components/ui/progress"
import { Badge } from "./components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckIcon, Link, ZoomInIcon, ZoomOutIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ViolationSummary } from "./components/ui/volations"
import type { WebviewTag } from "electron"

declare global {
  interface Window {
    electronAPI: {
      sendHighlightScript: (script: string) => void
      onExecuteHighlightScript: (callback: (script: string) => void) => void
      removeHighlightScriptListener: () => void
    }
    accessibilityAPI: {
      setAccessibilitySupport: (enabled: boolean) => void
      getAccessibilitySupport: () => Promise<boolean>
    }
  }
}

interface ViolationNode {
  target: string[]
  html: string
  failureSummary: string
}

interface Violation {
  description: string
  impact: "minor" | "moderate" | "serious" | "critical"
  nodes: ViolationNode[]
  helpUrl: string
}

interface ReportData {
  data: {
    response: {
      info: {
        violations: Violation[]
      }
    }
  }
}

export default function Home() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [accessibility, setAccessibility] = useState(false)
  const [impactFilter, setImpactFilter] = useState<string>("")
  const baseUrl = "http://159.65.41.182:5005"
  const apiUrl = `${baseUrl}/api/v1/scan`

  const iframeRef = useRef<WebviewTag | null>(null)

  const impactLevels = ["minor", "moderate", "serious", "critical"]
  const [url, setUrl] = useState("")

  useEffect(() => {
    console.log("Loading changed:", loading)
    if (loading) {
      console.log(apiUrl)
      console.log("Starting progress interval...")
      const timer = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 20 : 100))
        console.log("Progress is now:", progress)
      }, 500)
      return () => clearInterval(timer)
    }
  }, [loading, progress, apiUrl])

  const handleGenerateReport = useCallback(
    (url: string) => {
      setLoading(true)
      setProgress(0)
      setReportData(null)

      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
          return response.json()
        })
        .then((data: ReportData) => {
          setReportData(data)
          console.log(data.data.response.info)
          setProgress(100)
          highlightViolations(data.data.response.info.violations)
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => {
          setTimeout(() => {
            setLoading(false)
          }, 1500)
        })
    },
    [apiUrl],
  )

  const adjustZoom = (zoomFactor: number) => {
    if (iframeRef.current) {
      iframeRef.current.setZoomFactor(zoomFactor)
    }
  }

  const handleFilterChange = (value: string) => {
    setImpactFilter(value)
  }

  const filteredViolations = (reportData?.data.response.info.violations || []).filter((violation: Violation) =>
    impactFilter && impactFilter !== "all" ? violation.impact === impactFilter : true,
  )

  const highlightViolations = (violations: Violation[]) => {
    if (!iframeRef.current) return

    const highlightScript = `
      (function() {
        const severityColors = {
          critical: 'rgba(236,72,153,0.9)',
          serious: 'rgba(239,68,68,0.9)',
          moderate: 'rgba(251,191,36,0.9)',
          minor:   'rgba(96,165,250,0.8)',
        };
  
        const violationsData = ${JSON.stringify(violations)};
        const violationMap = new Map();
  
        violationsData.forEach(({ impact, nodes }) => {
          const color = severityColors[impact] || 'rgba(0, 0, 0, 0.2)';
          nodes.forEach(({ target }) => {
            target.forEach((selector) => {
              try {
                const element = document.querySelector(selector);
                if (!element) {
                  console.warn('No element found for selector:', selector);
                  return;
                }
                element.style.outline = \`2px solid \${color}\`;
                element.style.border = "4px solid #4CAF50";
                element.style.borderRadius = "15px"
                element.style.backgroundColor = color;
                element.style.marginTop = "10px"
                element.style.marginBottom = "10px"
                element.style.padding = "10px";
                violationMap.set(selector, element);
              } catch (error) {
                console.error('Error processing selector:', selector, error);
              }
            });
          });
        });
  
        window.scrollToViolation = (selector) => {
          const element = violationMap.get(selector);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        };
      })();
    `

    iframeRef.current.executeJavaScript(highlightScript).catch((error: unknown) => {
      console.error("Error executing highlight script:", error)
    })
  }

  const computeCounts = (violations: Violation[] | undefined) => {
    const counts: { [key: string]: number } = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    }
    violations?.forEach((violation) => {
      counts[violation.impact] = (counts[violation.impact] || 0) + 1
    })
    return counts
  }

  const computeTotalNodes = (violations: Violation[] | undefined) => {
    if (!violations) return 0
    return violations.reduce((total, violation) => total + violation.nodes.length, 0)
  }


  useEffect(() => {
    const webview = iframeRef.current
    if (!webview) return

    const handleNavigation = (event: Electron.DidNavigateEvent) => {
      const newUrl = event.url
      console.log("Moved to", newUrl)
      setUrl(newUrl)
      handleGenerateReport(newUrl)
    }

    webview.addEventListener("did-navigate", handleNavigation)
    webview.addEventListener("did-navigate-in-page", handleNavigation)

    return () => {
      webview.removeEventListener("did-navigate", handleNavigation)
      webview.removeEventListener("did-navigate-in-page", handleNavigation)
    }
  }, [handleGenerateReport])

  useEffect(() => {
    const checkAccessibilitySupport = async () => {
      if (window.accessibilityAPI) {
        try {
          const enabled = await window.accessibilityAPI.getAccessibilitySupport()
          setAccessibility(true)
          console.log("Accessibility support is currently:", enabled ? "enabled" : "disabled")
        } catch (error) {
          console.error("Error checking accessibility support:", error)
        }
      } else {
        console.warn("accessibilityAPI is not available")
      }
    }

    checkAccessibilitySupport()

    const handleHighlightScript = (script: string) => {
      if (iframeRef.current) {
        iframeRef.current.executeJavaScript(script).catch((error: unknown) => {
          console.error("Error executing highlight script:", error)
        })
      }
    }

    if (window.electronAPI) {
      window.electronAPI.onExecuteHighlightScript(handleHighlightScript)

      return () => {
        window.electronAPI.removeHighlightScriptListener()
      }
    } else {
      console.warn("electronAPI is not available")
    }
  }, [])

  const toggleAccessibility = useCallback(() => {
    const newState = !accessibility
    setAccessibility(newState)
    if (window.accessibilityAPI) {
      window.accessibilityAPI.setAccessibilitySupport(newState)
    }
  }, [accessibility])


  return (
    <div className="p-8 flex flex-col gap-2 h-screen">
      <h1 className="text-2xl font-semibold" role="heading" aria-level={1}>
        Site-Sense Studio
      </h1>
      <div className="flex gap-4 items-center">
        <Input
          type="text"
          placeholder="Enter url"
          className="max-w-96"
          onChange={(e) => setUrl(e.target.value)}
          aria-label="Enter URL to analyze"
        />

        <Button onClick={() => handleGenerateReport(url)} aria-label="Generate accessibility report">
          Generate report
        </Button>
        <Button
          onClick={toggleAccessibility}
          aria-label={`${accessibility ? "Disable" : "Enable"} accessibility support`}
          className={`flex items-center gap-2 ${accessibility ? "bg-green-500 hover:bg-green-600" : ""}`}
        >
          {accessibility && <CheckIcon className="w-4 h-4" />}
          Accessibility
        </Button>

        <ViolationSummary
          counts={
            reportData
              ? computeCounts(reportData.data.response.info.violations)
              : { critical: 0, serious: 0, moderate: 0, minor: 0 }
          }
        />
      </div>

      <div className="flex gap-4 p-5 h-full bg-gray-100">
        <div className="flex flex-col h-full w-[60%] bg-white p-4 rounded-lg shadow-md">
          {loading && <Progress value={progress} className="w-[60%] my-3" />}
          <webview
            ref={iframeRef}
            src={url}
            style={{
              width: "100%",
              height: "100%",
              border: "1px solid #ccc",
              borderRadius: "10px",
              paddingTop: "10px",
            }}
            useragent="Mozilla/5.0"
            webpreferences="contextIsolation=true, nodeIntegration=false"
            aria-label="Web page preview"
            title="Web page preview"
          ></webview>
          <div className="flex gap-2 my-2">
            <Button onClick={() => adjustZoom(1.1)} aria-label="Zoom in">
              <ZoomInIcon />
            </Button>
            <Button onClick={() => adjustZoom(0.9)} aria-label="Zoom out">
              <ZoomOutIcon />
            </Button>
          </div>
        </div>

        {reportData && (
          <div
            className="flex flex-col gap-4 overflow-y-auto px-4 py-2 w-[40%] bg-white rounded-lg shadow-md"
            style={{ maxHeight: "100%" }}
          >
            <h2 className="text-xl font-semibold text-gray-800" role="heading" aria-level={2}>
              Report Data:{" "}
                {reportData && (
                  <span className="text-lg text-green-700 font-medium text-gray-600 ml-2">
                    ({computeTotalNodes(reportData.data.response.info.violations)} nodes detected)
                  </span>
                )} 
            </h2>
            <div>
              {/*Filter Impact*/}
              <p>Filter by impact</p>
              <Select value={impactFilter || "all"} onValueChange={handleFilterChange}>
                <SelectTrigger aria-label="Filter violations by impact level">
                  <SelectValue placeholder="Level of impact">
                    {impactFilter && impactFilter !== "all"
                      ? `Filtered by ${impactFilter} impact`
                      : "Filter by impact level"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {impactLevels.map((level, index) => (
                    <SelectItem key={index} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/*Display filtered violations*/}
            {filteredViolations && filteredViolations.length > 0 ? (
              filteredViolations.map((violation: Violation, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg" role="heading" aria-level={3}>
                      {violation.description}
                    </CardTitle>
                    <CardDescription>
                      Impact: <Badge>{violation.impact}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="flex gap-2 items-center">
                      <strong className="text-base">Resolution:</strong>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex gap-2 items-center">
                            <Link size={15} aria-hidden="true" />
                            <a
                              href={violation.helpUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-orange-500 hover:underline"
                              aria-label={`Read the full accessibility guideline for ${violation.description}`}
                            >
                              Read the full accessibility guideline
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>Article about this accessibility issue</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </p>
                    <Accordion type="single" collapsible className="w-full mt-4">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-sm">View Violation Details</AccordionTrigger>
                        <AccordionContent>
                          <h5 className="font-semibold">Elements identified:</h5>
                          <ol className="list-decimal ml-5">
                            {violation.nodes.map((node: ViolationNode, idx: number) => (
                              <li
                                key={idx}
                                onMouseEnter={() =>
                                  iframeRef.current?.executeJavaScript(`window.scrollToViolation("${node.target[0]}");`)
                                }
                                className="transition-all duration-300 ease-in-out hover:py-2 hover:border-4 hover:border-blue-500 hover:rounded-lg"
                              >
                                <p>{node.html}</p>
                                <p>
                                  <strong>Target:</strong> {node.target.join(", ")}
                                </p>
                                <p>
                                  <strong>Failure Summary:</strong> {node.failureSummary}
                                </p>
                              </li>
                            ))}
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent>No violations found.</CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

