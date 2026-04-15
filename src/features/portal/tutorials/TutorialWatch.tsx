"use client";
import { ArrowLeft, Play, Pause, Volume2, Maximize, Clock, BookOpen } from "lucide-react";
import { PortalWrapper } from "../PortalWrapper";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { Button } from "@/components/form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { checkPaymentStatus } from "@/services/portal";

interface VideoData {
  id: string;
  title: string;
  subject: string;
  topic: string;
  duration: string;
  videoUrl: string;
  description: string;
  year: string;
  exam: string;
}

export default function TutorialWatch() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subject');
  const topicId = searchParams.get('topic');
  
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVideoData = async () => {
      try {
        setIsLoading(true);
        
        // Check payment status
        const paymentStatus = await checkPaymentStatus().catch(() => ({
          isSubscriptionActive: false,
          subscriptionExpiresAt: new Date().toISOString(),
          subscriptionType: 'basic',
          walletBalance: 0,
          currency: "₦",
        }));
        
        setHasActiveSubscription(paymentStatus.isSubscriptionActive);
        
        // Try to fetch actual video data from API
        if (topicId && subjectId) {
          try {
            // This would be implemented when video endpoints are available
            // For now, we don't have video endpoints in the Postman collection
            console.warn("Video endpoints not available in API");
            setVideoData(null);
          } catch (error) {
            console.error("Failed to fetch video data:", error);
            setVideoData(null);
          }
        }
      } catch (error) {
        console.error("Video data load error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVideoData();
  }, [topicId, subjectId]);

  const userName = user
    ? `${user.first_name} ${user.last_name}`
    : "Student User";

  // Show subscription warning if not active
  if (!hasActiveSubscription) {
    return (
      <PortalWrapper>
        <section className="px-6 py-20">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Subscription Required</h2>
            <p className="text-gray-600 mb-6">You need an active subscription to watch tutorial videos.</p>
            <Button text="Upgrade Subscription" className="px-8" />
          </div>
        </section>
      </PortalWrapper>
    );
  }

  if (isLoading) {
    return (
      <PortalWrapper>
        <section className="px-6 py-20">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading video...</p>
          </div>
        </section>
      </PortalWrapper>
    );
  }

  if (!videoData) {
    return (
      <PortalWrapper>
        <section className="px-6 py-20">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Video Not Found</h2>
            <p className="text-gray-600 mb-6">The requested tutorial video could not be found.</p>
            <Link href="/tutorials">
              <Button text="Back to Tutorials" variant="outline" className="px-8" />
            </Link>
          </div>
        </section>
      </PortalWrapper>
    );
  }

  return (
    <PortalWrapper>
      {/* Header with Back Button */}
      <section className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Link href="/tutorials">
            <Button 
              text=""
              variant="outline" 
              size="sm"
              className="p-2 border-gray-200 hover:border-blue-500"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{videoData.title}</h1>
            <p className="text-sm text-gray-500">{videoData.subject} • {videoData.topic}</p>
          </div>
        </div>
      </section>

      {/* Video Player Section */}
      <section className="px-6 py-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {/* Video Player */}
          <div className="relative bg-black aspect-video">
            <video 
              className="w-full h-full"
              controls
            >
              <source src={videoData.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Info */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{videoData.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{videoData.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{videoData.subject}</span>
                  </div>
                  <span>•</span>
                  <span>{videoData.year} {videoData.exam}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Student</div>
                <div className="text-sm font-semibold text-gray-900">{userName}</div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">About this tutorial</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{videoData.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Videos or Navigation */}
      <section className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Continue Learning</h3>
          <div className="flex gap-4">
            <Link href="/tutorials">
              <Button text="Back to All Tutorials" variant="outline" className="px-6" />
            </Link>
            <Button text="Next Video" className="px-6" disabled />
          </div>
        </div>
      </section>
    </PortalWrapper>
  );
}