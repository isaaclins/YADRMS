 "use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [showEULA, setShowEULA] = useState(false);

  /**
   * @issue SaveEULAToCookie 
   * @body Add a function to make it so when the user agrees to the EULA, it saves the agreement to a cookie.
   * 
   */
  const handleAgree = () => {
    router.push("/BuilderUI");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Card>
        <CardHeader>
          <CardTitle>EULA Agreement</CardTitle>
          <p className="text-sm text-gray-500">
            Please read the following End User License Agreement before
            proceeding.
          </p>
        </CardHeader>
        <CardContent>
          {!showEULA ? (
            <Button variant="outline" onClick={() => setShowEULA(true)}>
              Read EULA
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <div>
                  <h3><strong>End-User License Agreement (EULA) – Proof of Concept (PoC) Software</strong></h3>
                  <h3><strong>IMPORTANT – READ CAREFULLY:</strong></h3>
                  <h1><strong>By installing, copying, or otherwise using this Software, you agree to be bound by the following terms.</strong></h1>
                  <p>This updated EULA incorporates the provisions of the original agreement and includes additional terms and clarifications.</p>
                  <br />
                  <h3>1. Definitions</h3>
                  <p>1.1. <strong>“Software”</strong> refers to the Proof of Concept (PoC) software provided by the developers in its current, unmodified state.</p>
                  <p>1.2. <strong>“User”</strong> refers to the individual or entity that installs or otherwise uses the Software.</p>
                  <p>1.3. <strong>“Modification”</strong> refers to any alteration, enhancement, or derivative work based on the original Software. Modifications or derivative works are not covered by this EULA unless expressly agreed to in writing by the developers.</p>
                  <br />
                  <h3>2. Scope of Use</h3>
                  <p>2.1. The Software is provided solely for experimental, testing, and proof-of-concept purposes.</p>
                  <p>2.2. The Software must be used exclusively on hardware or systems that are under the User’s exclusive control (“User’s Own Machine”). This includes environments where the User has complete administrative control (e.g., locally installed physical devices or fully controlled virtual environments). Use on third-party managed services or networks is prohibited unless explicitly authorized.</p>
                  <p>2.3. The User agrees not to deploy the Software in any production, live, or public environment that may affect or impact systems or networks beyond the User’s Own Machine.</p>
                  <br />
                  <h3>3. Disclaimer of Warranty</h3>
                  <p>3.1. The Software is provided “as is,” without any warranty of any kind, whether express, implied, statutory, or otherwise.</p>
                  <p>3.2. The developers explicitly disclaim all warranties, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
                  <p>3.3. The User acknowledges that the Software is experimental in nature and may contain errors or vulnerabilities.</p>
                  <br />
                  <h3>4. Limitation of Liability</h3>
                  <p>4.1. In no event shall the software developers, authors, or affiliated parties be liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising from the use or inability to use the Software, even if advised of the possibility of such damages.</p>
                  <p>4.2. The User assumes full responsibility for any consequences arising from the use or misuse of the Software, including any impact on systems, networks, or third-party data.</p>
                  <br />
                  <h3>5. Indemnification</h3>
                  <p>The User agrees to indemnify, defend, and hold harmless the software developers, authors, and affiliated parties from and against any claims, liabilities, damages, losses, or expenses (including reasonable attorneys’ fees) arising out of or relating to the User’s use, modification, or distribution of the Software.</p>
                  <br />
                  <h3>6. Restrictions on Use</h3>
                  <p>6.1. The Software is provided exclusively as a Proof of Concept and is not intended for production or live environment use.</p>
                  <p>6.2. The Software must not be deployed or used in any manner that could impact or harm any person, system, or network beyond the User’s Own Machine.</p>
                  <p>6.3. The User is prohibited from incorporating the Software into any system, application, or service that could facilitate malicious activities or cause unintended harm.</p>
                  <br />
                  <h3>7. Modifications and Derivative Works</h3>
                  <p>7.1. Any modifications, enhancements, or derivative works of the Software created by the User are considered separate and distinct from the original Software and are not governed by this EULA unless expressly agreed to in writing by the developers.</p>
                  <p>7.2. The User is solely responsible for ensuring that any modifications comply with applicable laws and do not facilitate harmful activities.</p>
                  <br />
                  <h3>8. Governing Law and Jurisdiction</h3>
                  <p>8.1. This EULA shall be governed by and construed in accordance with the laws of the jurisdiction in which the User resides, provided that such laws do not conflict with fundamental rights under applicable international law.</p>
                  <p>8.2. In the event of any disputes arising from this EULA, the parties agree to submit to the competent courts of the User’s jurisdiction, unless a different forum is mutually agreed upon in writing.</p>
                  <br />
                  <h3>9. Amendments</h3>
                  <p>9.1. The developers reserve the right to modify or amend this EULA at any time.</p>
                  <p>9.2. Any modifications will be communicated to Users through appropriate channels, and continued use of the Software after such amendments constitutes acceptance of the updated terms.</p>
                  <br />
                  <h3>10. Entire Agreement</h3>
                  <p>This EULA, together with any written modifications agreed upon by the parties, constitutes the entire agreement regarding the use of the Software and supersedes any prior understandings, representations, or agreements, whether written or oral.</p>
                  <br />
                  <h3>11. Acceptance of Terms</h3>
                  <p>By installing, copying, or otherwise using the Software, the User acknowledges that they have read, understood, and agree to be bound by the terms of this updated EULA.</p>
                  <br />
                </div>
              </div>
              <div className="flex gap-4 justify-end">
                <Button onClick={handleAgree}>
                  Yes, I've read the EULA and accept the terms.
                </Button>
                <Button variant="outline" onClick={() => setShowEULA(false)}>
                  No, I do not accept the terms.
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
