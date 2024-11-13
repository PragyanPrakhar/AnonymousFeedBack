"use client";
import React, { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";

const page = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const { toast } = useToast();
    const handleDeleteMessage = (messageId) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };
    const { data: session } = useSession();
    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });
    const { register, watch, setValue } = form;
    const acceptMessages = watch("acceptMessages");
    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const reponse = await axios.get("/api/accept-messages");
            setValue("acceptMessages", reponse.data.isAcceptingMessage);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Error fetching message acceptance status",
                variant: "destructive",
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    const fetchMessages = useCallback(
        async (refresh = false) => {
            setIsLoading(true);
            setIsSwitchLoading(true);
            try {
                const response = await axios.get("/api/get-messages");
                setMessages(response.data.messages || []);
                if (refresh) {
                    toast({
                        title: "Messages Refreshed",
                        description: "Showing latest Messages",
                    });
                }
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Error fetching messages",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
                setIsSwitchLoading(false);
            }
        },
        [setIsLoading, setMessages]
    );
    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
        fetchAcceptMessages();
    }, [session, setValue, fetchAcceptMessages, fetchMessages]);
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post("/api/accept-messages", {
                acceptMessages: !acceptMessages,
            });
            setValue("acceptMessages", !acceptMessages);
            toast({
                title: "response.data.message",
                variant: "destructive",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Error updating message acceptance status",
                variant: "destructive",
            });
        }
    };
    const { username } = session?.user;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
    };
    if (!session || !session.user)
        return <div>Not Logged In, Please Log in</div>;
    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">
                    Copy Your Unique Link
                </h2>{" "}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register("acceptMessages")}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? "On" : "Off"}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={message._id}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
};

export default page;
