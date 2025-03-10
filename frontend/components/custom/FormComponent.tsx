import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PythonSchema } from "@/lib/schemas/PythonSchema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TextInput, CheckboxInput } from "@/components/custom/FormElements";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface FormComponentProps {
    onSubmit: SubmitHandler<any>;
    liveData: any;
    setLiveData: React.Dispatch<React.SetStateAction<any>>;
    fields: { [key: string]: any };
}

const FormComponent: React.FC<FormComponentProps> = ({ onSubmit, liveData, setLiveData, fields }) => {
    const form = useForm({
        defaultValues: fields,
        resolver: zodResolver(PythonSchema),
    });

    const watchedValues = form.watch();

    useEffect(() => {
        if (JSON.stringify(liveData) !== JSON.stringify(watchedValues)) {
            setLiveData(watchedValues);
        }
    }, [watchedValues, liveData, setLiveData]);

    const handleCompile = async () => {
        try {
            const response = await fetch("/api/compile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                toast("Compilation started", { description: "Your Client is being compiled.", duration: 5000 });
            } else {
                toast("Compilation failed", { description: "There was an error starting the compilation.", duration: 5000 });
            }
        } catch (error) {
            toast("Compilation failed", { description: "There was an error starting the compilation.", duration: 5000 });
        }
    };

    const renderFields = (fields: { [key: string]: any }, parentName: string = '') => {
        return Object.keys(fields).map((key) => {
            const value = fields[key];
            const fieldName = parentName ? `${parentName}.${key}` : key;
            const label = key;

            if (typeof value === "string") {
                return <TextInput key={fieldName} name={fieldName} control={form.control} label={label} placeholder={label} />;
            } else if (typeof value === "boolean") {
                return <CheckboxInput key={fieldName} name={fieldName} control={form.control} label={label} />;
            } else if (typeof value === "number") {
                return <TextInput key={fieldName} name={fieldName} control={form.control} label={label} placeholder={label} type="number" />;
            } else if (typeof value === "object" && value !== null) {
                return (
                    <div key={fieldName} className="nested-fields">
                        <h4>{label}</h4>
                        {renderFields(value, fieldName)}
                    </div>
                );
            }
            return null;
        });
    };

    return (
        <div className="overflow-x-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
                    {renderFields(fields)}
                    <div className="flex justify-between">
                        <Button variant="outline" type="submit" onClick={() => { toast("Your settings have been saved", { description: "You can now compile your Client!", duration: 5000, action: { label: "discard", onClick: () => console.log("discard"), }, }); }}>
                            Save Settings
                        </Button>
                        <Button variant="outline" type="button" onClick={handleCompile}>
                            Compile
                        </Button>
                    </div>
                </form>
            </Form>
            <div >
                <Alert className="overflow-x-auto">
                    <Terminal />
                    <AlertTitle>
                        <b>Live Data</b>
                    </AlertTitle>
                    <AlertDescription>
                        <pre>{JSON.stringify(watchedValues, null, 2)}</pre>
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    );
};

export default FormComponent;