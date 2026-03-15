import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        dashboard: 'Dashboard',
        documents: 'Documents',
        property: 'Property',
        insurance: 'Insurance',
        weather: 'Weather',
        profile: 'Profile',
        logout: 'Logout'
      },
      // Auth
      auth: {
        login: 'Login',
        signup: 'Sign Up',
        email: 'Email',
        password: 'Password',
        name: 'Full Name',
        mobile: 'Mobile Number',
        confirmPassword: 'Confirm Password',
        forgotPassword: 'Forgot Password?',
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: 'Already have an account?',
        loginSuccess: 'Login successful!',
        signupSuccess: 'Registration successful!',
        loginButton: 'Sign In',
        signupButton: 'Create Account',
        
        // Login Page
        welcomeBack: 'Welcome Back',
        loginToManage: 'to manage your farm',
        emailOrMobile: 'or',
        enterEmailOrMobile: 'Enter email or 10-digit mobile',
        enterPassword: 'Enter your password',
        rememberMe: 'Remember me',
        
        // Signup Page
        joinFarmview: 'Join FarmView AI',
        createAccountDesc: 'Create your farmer account and start smart farming',
        enterFullName: 'Enter your full name',
        emailPlaceholder: 'your.email@example.com',
        mobilePlaceholder: '10-digit mobile number',
        preferredLanguage: 'Preferred Language',
        passwordPlaceholder: 'Min. 6 characters',
        confirmPasswordPlaceholder: 'Confirm password',
        creatingAccount: 'Creating Account...',
        yourFarmerId: 'Your Farmer ID:',
        
        // Demo Credentials
        demoCredentials: 'Demo Credentials:',
        demoEmail: 'Email: demo@farmview.com | Password: demo123',
        
        // Validation Messages
        emailOrMobileRequired: 'Email or mobile number is required',
        passwordRequired: 'Password is required',
        passwordMinLength: 'Password must be at least 6 characters',
        fixErrors: 'Please fix the errors in the form',
        nameRequired: 'Name is required',
        nameMinLength: 'Name must be at least 3 characters',
        emailRequired: 'Email is required',
        emailInvalid: 'Email is invalid',
        mobileRequired: 'Mobile number is required',
        mobileInvalid: 'Mobile must be 10 digits',
        passwordsNoMatch: 'Passwords do not match',
        loginFailed: 'Login failed. Please check your credentials.',
        signupFailed: 'Signup failed. Please try again.',
        welcomeBackUser: 'Welcome back,'
      },
      // Dashboard
      dashboard: {
        welcome: 'Welcome back',
        farmerId: 'Farmer ID',
        totalProperties: 'Total Properties',
        activeInsurance: 'Active Insurance',
        documents: 'Documents',
        weatherAlert: 'Weather Alert',
        recentActivity: 'Recent Activity',
        quickActions: 'Quick Actions',
        activeFarmer: 'Active Farmer',
        status: 'Status',
        active: 'Active',
        manageDocuments: 'Manage documents',
        viewProperties: 'View properties',
        insurancePolicies: 'Insurance policies',
        weatherForecast: 'Weather forecast',
        cropIntelligence: 'Crop Intelligence',
        aiCropAnalysis: 'AI-powered crop analysis',
        startMessage: 'Start by adding your property or uploading documents'
      },
      // Common
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        upload: 'Upload',
        download: 'Download',
        submit: 'Submit',
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
        noData: 'No data available',
        search: 'Search',
        filter: 'Filter',
        actions: 'Actions'
      },
      // Documents
      documents: {
        title: 'My Documents',
        subtitle: 'Manage all your farm-related documents securely',
        upload: 'Upload Document',
        type: 'Document Type',
        name: 'Document Name',
        category: 'Category',
        status: 'Status',
        uploadedOn: 'Uploaded On',
        searchPlaceholder: 'Search documents...',
        yourDocuments: 'Your Documents',
        noDocuments: 'No documents uploaded yet',
        noDocumentsDesc: 'Upload your first document to get started',
        noSearchResults: 'No documents found',
        tryDifferentSearch: 'Try a different search term',
        download: 'Download',
        downloadStarted: 'Download started!',
        uploadSuccess: 'Document uploaded successfully!',
        uploadFailed: 'Upload failed',
        loadFailed: 'Failed to load documents',
        downloadFailed: 'Failed to download document',
        selectFile: 'Please select a file',
        provideName: 'Please provide a document name',
        
        // AI Verification
        aiVerification: 'AI Document Verification',
        aiSubtitle: 'Automated fraud prevention',
        howItWorks: 'How it works:',
        aiStep1: 'Upload land documents (7/12, Survey Doc)',
        aiStep2: 'AI extracts text using OCR',
        aiStep3: 'Validates data automatically',
        aiStep4: 'Auto-approves if match > 85%',
        aiStep5: 'No manual verification needed!',
        startAIVerification: 'Start AI Verification',
        aiVerified: 'AI Verified',
        match: 'Match',
        
        // Manual Upload
        manualUpload: 'Manual Upload',
        documentNameLabel: 'Document Name *',
        documentNamePlaceholder: 'e.g., Land Ownership Certificate',
        documentTypeLabel: 'Document Type *',
        dragDrop: 'Drag & drop file here',
        or: 'or',
        browseFiles: 'Browse Files',
        uploading: 'Uploading...',
        uploadDocument: 'Upload Document',
        
        // Document Types
        types: {
          panCard: 'PAN Card',
          aadhaar: 'Aadhaar Card',
          landDocs: 'Land Documents',
          insurance: 'Insurance Policy',
          bankPassbook: 'Bank Passbook',
          identity: 'Identity',
          other: 'Other'
        },
        
        // Status
        statuses: {
          verified: 'Verified',
          pending: 'Pending',
          rejected: 'Rejected'
        }
      },
      // Property
      property: {
        title: 'My Properties',
        addProperty: 'Add Property',
        propertyName: 'Property Name',
        area: 'Area',
        location: 'Location',
        soilType: 'Soil Type',
        currentCrop: 'Current Crop',
        drawOnMap: 'Draw on Map'
      },
      // Insurance
      insurance: {
        title: 'Insurance',
        addPolicy: 'Add Policy',
        policyNumber: 'Policy Number',
        policyType: 'Policy Type',
        provider: 'Provider',
        coverage: 'Coverage Amount',
        premium: 'Premium',
        submitClaim: 'Submit Claim',
        claimHistory: 'Claim History'
      },
      // Weather
      weather: {
        title: 'Weather',
        current: 'Current Weather',
        forecast: 'Forecast',
        temperature: 'Temperature',
        humidity: 'Humidity',
        windSpeed: 'Wind Speed',
        rainfall: 'Rainfall'
      },
      // Claims
      claims: {
        title: 'Insurance Claims',
        subtitle: 'Track your GeoAI verified insurance claims',
        approved: 'Approved',
        processing: 'Processing',
        underReview: 'Under Review',
        rejected: 'Rejected',
        paid: 'Paid',
        noClaims: 'No Claims Yet',
        noClaimsDesc: "You haven't filed any insurance claims",
        fileFirstClaim: 'File Your First Claim',
        filedOn: 'Filed on',
        estimatedPayout: 'Estimated Payout',
        property: 'Property',
        geoaiAssessment: 'GeoAI Assessment',
        processingLabel: 'Processing',
        geoaiVerified: 'GeoAI Verified',
        damageReason: 'Damage Reason',
        notSpecified: 'Not specified',
        payoutIn: 'Payout in 3-5 days',
        underReviewText: 'Under Review',
        viewFullReport: 'View Full Report',
        downloadPDF: 'Download PDF',
        claimDetails: 'Claim Details',
        fullReportComing: 'Full claim report coming soon...',
        satelliteEvidence: 'Satellite Evidence (NDVI)',
        historical: 'Historical (Healthy)',
        current: 'Current (Damaged)',
        aboutGeoai: 'About GeoAI Verification',
        geoaiDescription: 'All claims are automatically verified using Sentinel-2 satellite imagery and NDVI analysis. Our AI system compares current crop health with historical baselines to accurately assess damage and detect potential fraud. This ensures fair and fast claim processing without manual field inspections.'
      },
      // Field Advisor
      fieldAdvisor: {
        title: 'Know Your Field - AI Advisor',
        subtitle: 'Get personalized farming advice powered by AI for your specific field',
        selectField: 'Select a Field to Get Started',
        noProperties: "You don't have any properties yet.",
        addFirstProperty: 'Add Your First Property',
        loadFailed: 'Failed to load your properties',
        aiError: 'Failed to get AI response',
        changeField: 'Change Field',
        chatAboutField: 'Chat About This Field →',
        
        // Field Info
        verifiedProperty: 'Verified Property',
        currentCrop: 'Current Crop',
        area: 'Area',
        soilType: 'Soil Type',
        irrigation: 'Irrigation',
        notSpecified: 'Not specified',
        hectares: 'hectares',
        
        // Chat
        aiAdvisor: 'AI Advisor',
        aiThinking: 'AI is thinking...',
        relatedTopics: 'Related Topics:',
        quickQuestions: 'Quick Questions:',
        askPlaceholder: 'Ask anything about your field... (Press Enter to send)',
        tipMessage: '💡 Tip: Be specific! Mention your concerns, observations, or goals for better advice.',
        errorMessage: '❌ Sorry, I encountered an error. Please try again or rephrase your question.',
        
        // Welcome Message
        welcomeHello: 'Hello! 🌾 I\'m your AI Field Advisor for',
        welcomeCanHelp: 'I can help you with:',
        welcomeItem1: '🌱 Crop recommendations and best practices',
        welcomeItem2: '🌦️ Weather-based farming advice',
        welcomeItem3: '💧 Irrigation and soil management',
        welcomeItem4: '🐛 Pest and disease prevention',
        welcomeItem5: '📈 Yield optimization strategies',
        welcomeClosing: 'Feel free to ask me anything about your field!',
        
        // Quick Questions
        questions: {
          weather: "What's the best time to plant based on weather?",
          water: "How much water does my crop need?",
          pests: "What are common pests for my crop?",
          soil: "How can I improve my soil quality?",
          yield: "Tips to increase crop yield?",
          diseases: "What diseases should I watch for?"
        }
      },
      // Insurance
      insurance: {
        title: 'Insurance Policies',
        subtitle: 'Manage your farm insurance coverage',
        addNewPolicy: 'Add New Policy',
        createNewPolicy: 'Create New Policy',
        yourPolicies: 'Your Policies',
        noPolicies: 'No insurance policies yet',
        noPoliciesDesc: 'Protect your farm with comprehensive insurance coverage',
        addFirstPolicy: 'Add Your First Policy',
        viewDetails: 'View Details',
        fileClaim: 'File Claim',
        
        // Form Fields
        policyNumber: 'Policy Number',
        policyNumberPlaceholder: 'e.g., CROP-2025-001234',
        policyType: 'Policy Type',
        providerName: 'Insurance Provider Name',
        providerNamePlaceholder: 'e.g., Agriculture Insurance Company',
        providerContact: 'Provider Contact',
        providerContactPlaceholder: 'e.g., +91 9876543210',
        providerEmail: 'Provider Email',
        providerEmailPlaceholder: 'e.g., support@insurance.com',
        coverageAmount: 'Coverage Amount (₹)',
        coverageAmountPlaceholder: 'e.g., 500000',
        premiumAmount: 'Premium Amount (₹)',
        premiumAmountPlaceholder: 'e.g., 15000',
        premiumFrequency: 'Premium Frequency',
        propertyId: 'Property ID (Optional)',
        propertyIdPlaceholder: 'Link to property',
        startDate: 'Start Date',
        endDate: 'End Date',
        required: '*',
        
        // Policy Types
        cropInsurance: 'Crop Insurance',
        weatherBased: 'Weather-Based Insurance',
        livestock: 'Livestock Insurance',
        farmEquipment: 'Farm Equipment Insurance',
        multiPeril: 'Multi-Peril Crop Insurance',
        other: 'Other',
        
        // Premium Frequencies
        annual: 'Annual',
        semiAnnual: 'Semi-Annual',
        quarterly: 'Quarterly',
        oneTime: 'One-Time',
        
        // Statuses
        active: 'Active',
        pending: 'Pending',
        expired: 'Expired',
        
        // Actions
        createPolicy: 'Create Policy',
        creating: 'Creating...',
        cancel: 'Cancel',
        
        // Policy Details
        type: 'Type',
        coverage: 'Coverage',
        premium: 'Premium',
        valid: 'Valid',
        year: 'year',
        
        // Messages
        fillRequired: 'Please fill all required fields',
        createSuccess: 'Insurance policy created!',
        createFailed: 'Failed to create policy',
        loadFailed: 'Failed to load policies'
      },
      // Crop Intelligence
      cropIntel: {
        title: 'Crop Intelligence Dashboard',
        subtitle: 'AI-powered crop analysis using satellite data & NDVI',
        backButton: 'Back',
        selectProperty: 'Select Property',
        available: 'available',
        propertySelected: 'Property selected',
        noProperties: 'No Properties Found',
        noPropertiesDesc: 'You need to add a property before using Crop Intelligence features.',
        addProperty: 'Add Property',
        backToDashboard: 'Back to Dashboard',
        loadingProperties: 'Loading properties...',
        
        // Tabs
        tabs: {
          analyze: 'Analyze',
          identify: 'Identify Crop',
          recommend: 'Recommend',
          issues: 'Health Check',
          yield: 'Predict Yield',
          ndvi: 'NDVI Stats'
        },
        
        // Analyze Tab
        analyze: {
          title: 'Comprehensive Crop Analysis',
          button: 'Analyze Crop',
          analyzing: 'Analyzing...',
          cropIdentification: 'Crop Identification',
          confidence: 'Confident',
          healthAssessment: 'Health Assessment',
          overallHealth: 'Overall Health',
          healthScore: 'Health Score',
          detectedIssues: 'Detected Issues',
          issue: 'Issue',
          severity: 'Severity',
          action: 'Action',
          cropRecommendation: 'Next Crop Recommendation',
          actionableInsights: 'Actionable Insights'
        },
        
        // Identify Tab
        identify: {
          title: 'Identify Crop Type',
          button: 'Identify Crop',
          identifying: 'Identifying...',
          sure: 'Sure',
          whyThisCrop: 'Why This Crop?',
          couldAlsoBe: 'Could Also Be:',
          pattern: 'Pattern',
          ndviSignature: 'NDVI Signature',
          seasonMatch: 'Season Match'
        },
        
        // Recommend Tab
        recommend: {
          title: 'Next Crop Recommendation',
          button: 'Get Recommendation',
          analyzing: 'Analyzing...',
          expectedYield: 'Expected Yield',
          profitability: 'Profitability',
          roi: 'ROI',
          whyThisCrop: 'Why This Crop?',
          soilPreparation: 'Soil Preparation Steps',
          waterRequirement: 'Water Requirement',
          bestPlantingTime: 'Best Planting Time',
          riskFactors: 'Risk Factors'
        },
        
        // Issues Tab
        issues: {
          title: 'Crop Health Check',
          button: 'Scan for Issues',
          scanning: 'Scanning...',
          healthStatus: 'Health Status',
          detectedIssues: 'Detected Issues',
          symptoms: 'Symptoms',
          recommendedActions: 'Recommended Actions',
          priority: 'Priority',
          timing: 'Timing',
          cost: 'Cost',
          benefit: 'Benefit',
          noIssuesTitle: 'No Issues Detected!',
          noIssuesDesc: 'Your crop is healthy and doing well.',
          monitoringAdvice: 'Monitoring Advice',
          yieldImpact: 'Potential Yield Impact',
          affectedArea: 'Affected Area',
          location: 'Location',
          urgency: 'Urgency'
        },
        
        // Yield Tab
        yield: {
          title: 'Yield Prediction',
          button: 'Predict Yield',
          predicting: 'Predicting...',
          expectedYield: 'Expected Yield',
          range: 'Range',
          confidenceLevel: 'Confidence',
          positiveFactors: 'Positive Factors',
          challenges: 'Challenges',
          comparison: 'Comparison',
          vsAverage: 'vs Average',
          vsPotential: 'vs Potential',
          vsLastYear: 'vs Last Year',
          bestHarvestTime: 'Best Harvest Time',
          qualityExpectation: 'Quality Expectation',
          howToImprove: 'How to Improve Yield'
        },
        
        // NDVI Tab
        ndvi: {
          title: 'NDVI Statistics',
          button: 'Get NDVI Data',
          loading: 'Loading...',
          meanNDVI: 'Mean NDVI',
          median: 'Median',
          min: 'Min',
          max: 'Max',
          vegetationDistribution: 'Vegetation Distribution',
          healthy: 'Healthy (NDVI > 0.6)',
          moderate: 'Moderate (0.3-0.6)',
          stressed: 'Stressed (0-0.3)',
          bare: 'Bare/Water (< 0)',
          status: 'Status',
          ndviGuide: 'NDVI Guide',
          dataQuality: 'Data Quality',
          totalPixels: 'Total Pixels',
          validPixels: 'Valid Pixels',
          healthyPixels: 'Healthy Pixels',
          stressedPixels: 'Stressed Pixels'
        }
      },
      // Landing Page
      landing: {
        heroTitle: 'Smart Farming with',
        heroTitleHighlight: 'AI Technology',
        heroSubtitle: 'Satellite-based crop monitoring, automated insurance claims with GeoAI verification, and complete farm management in one powerful platform',
        getStartedFree: 'Get Started Free',
        loginToDashboard: 'Login to Dashboard',
        geoaiBadge: 'Now with GeoAI Insurance Claims',
        benefits: {
          satellite: 'Real-time satellite monitoring of your crops',
          claims: 'Automated insurance claim processing',
          weather: 'Weather forecasts tailored to your location',
          documents: 'Secure document management system',
          multilang: 'Multi-language support for farmers',
          ai: 'AI-powered crop health analysis'
        },
        stats: {
          farmers: 'Farmers Registered',
          hectares: 'Hectares Monitored',
          claims: 'Claims Processed',
          uptime: 'Uptime Guarantee'
        },
        features: {
          title: 'Everything You Need to Succeed',
          subtitle: 'Comprehensive tools designed specifically for modern Indian farmers',
          property: {
            title: 'Property Management',
            desc: 'Draw and manage your farm boundaries on interactive maps'
          },
          documents: {
            title: 'Document Management',
            desc: 'Securely store and manage all your farm documents'
          },
          insurance: {
            title: 'Insurance Integration',
            desc: 'Manage policies and submit claims easily'
          },
          weather: {
            title: 'Weather Forecasts',
            desc: 'Get real-time weather updates for your location'
          },
          monitoring: {
            title: 'Crop Monitoring',
            desc: 'Satellite-based crop health analysis'
          },
          smart: {
            title: 'Smart Farming',
            desc: 'AI-powered insights for better yields'
          }
        },
        cta: {
          title: 'Ready to Transform Your Farm?',
          subtitle: 'Join thousands of farmers already using FarmView AI to increase yields and protect their investments',
          createAccount: 'Create Free Account',
          learnMore: 'Learn More'
        }
      },
      // Profile
      profile: {
        title: 'My Profile',
        subtitle: 'Manage your account settings',
        personalInfo: 'Personal Information',
        securitySettings: 'Security Settings',
        languageSettings: 'Language Settings',
        editProfile: 'Edit Profile',
        saveChanges: 'Save Changes',
        cancel: 'Cancel',
        uploadPicture: 'Upload Picture',
        deletePicture: 'Delete Picture',
        changePassword: 'Change Password',
        updatePassword: 'Update Password',
        
        // Fields
        farmerId: 'Farmer ID',
        fullName: 'Full Name',
        email: 'Email Address',
        mobile: 'Mobile Number',
        address: 'Address',
        memberSince: 'Member Since',
        accountStatus: 'Account Status',
        preferredLanguage: 'Preferred Language',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmNewPassword: 'Confirm New Password',
        
        // Placeholders
        enterName: 'Enter your full name',
        enterEmail: 'Enter your email',
        enterMobile: 'Enter your mobile number',
        enterAddress: 'Enter your address',
        enterCurrentPassword: 'Enter current password',
        enterNewPassword: 'Enter new password',
        confirmPasswordPlaceholder: 'Confirm new password',
        
        // Messages
        profileUpdated: 'Profile updated successfully!',
        profileUpdateFailed: 'Failed to update profile',
        passwordUpdated: 'Password updated successfully!',
        passwordUpdateFailed: 'Failed to update password',
        pictureUploaded: 'Profile picture uploaded!',
        pictureUploadFailed: 'Failed to upload picture',
        pictureDeleted: 'Profile picture deleted!',
        pictureDeleteFailed: 'Failed to delete picture',
        
        // Validation
        nameRequired: 'Name is required',
        nameMinLength: 'Name must be at least 3 characters',
        emailRequired: 'Email is required',
        emailInvalid: 'Email is invalid',
        mobileRequired: 'Mobile number is required',
        mobileInvalid: 'Mobile must be 10 digits',
        currentPasswordRequired: 'Current password is required',
        newPasswordRequired: 'New password is required',
        newPasswordMinLength: 'Password must be at least 6 characters',
        passwordsNoMatch: 'Passwords do not match',
        fixErrors: 'Please fix the errors in the form'
      },
      // Property
      property: {
        title: 'Property Management',
        subtitle: 'Manage your farm properties and view satellite analysis',
        myProperties: 'My Properties',
        addProperty: 'Add New Property',
        addNew: 'Add New Property',
        noProperties: 'No Properties Yet',
        noPropertiesDesc: 'Start by creating your first property below',
        propertyDetails: 'Property Details',
        locationInfo: 'Location Information',
        cropInfo: 'Crop Information',
        addFirstProperty: 'Add Your First Property',
        
        // Property Card
        verified: 'Verified',
        pendingVerification: 'Pending Verification',
        crop: 'Crop',
        area: 'Area',
        soil: 'Soil',
        irrigation: 'Irrigation',
        notSpecified: 'Not specified',
        documentsAttached: 'document(s) attached',
        viewSatellite: 'View Satellite Analysis',
        
        // Form Fields
        propertyName: 'Property Name',
        propertyNamePlaceholder: 'e.g., North Field, Rice Paddy',
        searchLocation: 'Search Location',
        addressPlaceholder: 'Type address (e.g., Mumbai, Maharashtra)',
        searching: 'Searching...',
        search: 'Search',
        calculatedArea: 'Calculated Area',
        drawPolygon: 'Draw polygon on map',
        drawOnMap: 'Draw on Map',
        drawInstruction: 'Click on map to draw your property boundary',
        currentCrop: 'Current Crop',
        cropPlaceholder: 'e.g., Wheat, Rice, Cotton',
        cropHint: 'Choose from {{count}}+ crops or type to search',
        soilType: 'Soil Type',
        irrigationType: 'Irrigation Type',
        uploadDocuments: 'Upload Documents',
        propertyPapers: 'Property Papers (images/PDF, max 5)',
        dragDrop: 'Drag & drop files here or click to browse',
        maxFiles: 'Max 5 files, 5MB each',
        
        // Soil Types
        soilTypes: {
          alluvial: 'Alluvial',
          black: 'Black',
          red: 'Red',
          laterite: 'Laterite',
          desert: 'Desert',
          mountain: 'Mountain',
          other: 'Other'
        },
        
        // Irrigation Types
        irrigationTypes: {
          rainfed: 'Rainfed',
          drip: 'Drip',
          sprinkler: 'Sprinkler',
          other: 'Other'
        },
        
        // Crop Recommendations
        getCropRecommendations: 'Get Crop Recommendations (1000+ Crops)',
        gettingRecommendations: 'Getting Recommendations...',
        topRecommended: 'Top Recommended Crops',
        climate: 'Climate',
        bestMatches: 'Best Matches',
        cereals: 'Cereals',
        vegetables: 'Vegetables',
        fruits: 'Fruits',
        spices: 'Spices',
        analyzedCrops: 'Analyzed {{count}} crops • Click any crop to select',
        
        // Document Verification
        documentVerified: 'Document Verified',
        match: 'Match',
        verifiedMessage: 'Your documents have been verified by AI. You can now register your property securely.',
        noVerifiedDocs: 'No Verified Documents',
        recommendVerification: 'We recommend verifying your land documents using AI for fraud prevention.',
        verifyNow: 'Verify Documents Now',
        
        // Alerts and Confirmations
        drawBoundaryAlert: 'Please draw your field boundary on the map',
        noVerifiedDocsConfirm: '⚠️ No verified documents found!\n\nFor fraud prevention, we recommend verifying your land documents using AI verification in the Documents page.\n\nDo you want to proceed without verification?',
        verifyFirstAlert: 'Please verify your documents first from the Documents page.',
        oldVerificationConfirm: '⚠️ Your document verification is older than 24 hours.\n\nWe recommend re-verifying your documents for security.\n\nDo you want to proceed anyway?',
        reverifyAlert: 'Please re-verify your documents from the Documents page.',
        registeredSuccess: '✅ Property registered successfully!',
        createFailed: 'Failed to create property',
        
        // Actions
        submitProperty: 'Submit Property',
        createProperty: 'Create Property',
        submitting: 'Submitting...',
        cancel: 'Cancel',
        viewDetails: 'View Details',
        analyzeSatellite: 'Analyze Satellite',
        getRecommendations: 'Get Recommendations',
        aiVerify: 'AI Verify',
        verifying: 'Verifying...',
        verified: 'Verified',
        delete: 'Delete',
        deleting: 'Deleting...',
        edit: 'Edit',
        
        // Messages
        propertyAdded: 'Property added successfully!',
        propertyAddFailed: 'Failed to add property',
        propertiesLoadFailed: 'Failed to load properties',
        drawBoundary: 'Please draw property boundary on map',
        locationNotFound: 'Location not found',
        propertyDeleted: 'Property deleted successfully!',
        deleteFailed: 'Failed to delete property',
        
        // Recommendations
        cropRecommendations: 'Crop Recommendations',
        loadingRecommendations: 'Loading recommendations...',
        recommendedCrops: 'Recommended Crops',
        basedOn: 'Based on your property conditions',
        noRecommendations: 'No recommendations available',
        tryAgain: 'Try Again'
      },
      // Weather
      weather: {
        title: 'Weather Monitoring',
        subtitle: 'Real-time weather and AI predictions',
        yourProperties: 'Your Properties',
        noProperties: 'No properties found',
        addPropertyFirst: 'Add a property first',
        selectProperty: 'Select a property to view weather',
        chooseProperty: 'Choose from your properties',
        
        // Current Weather
        temperature: 'Temperature',
        humidity: 'Humidity',
        wind: 'Wind',
        pressure: 'Pressure',
        weatherDescription: 'Weather Description',
        
        // AI Prediction
        aiPrediction: 'AI Crop Prediction',
        runPrediction: 'Run Prediction',
        predicting: 'Predicting...',
        predictionResults: 'Prediction Results',
        clickToAnalyze: 'Click "Run Prediction" to analyze conditions',
        mlInsights: 'ML-powered farming insights',
        
        // Messages
        weatherLoaded: 'Weather loaded!',
        weatherLoadFailed: 'Failed to fetch weather',
        predictionComplete: 'ML prediction completed!',
        predictionFailed: 'Prediction failed',
        selectPropertyFirst: 'Select property and load weather first',
        propertiesLoadFailed: 'Failed to load properties'
      },
      // AI Chatbot
      chatbot: {
        title: 'FarmView AI',
        subtitle: 'Ask About Crops, Weather, and More!',
        aiAssistant: 'AI Assistant',
        placeholder: 'Ask about crops, farming, weather...',
        disclaimer: 'AI can make mistakes. Verify important information.',
        quickQuestions: 'Quick questions:',
        
        // Welcome Message
        welcomeTitle: 'Hello! I\'m your FarmView AI Assistant.',
        welcomeHelp: 'I can help you with:',
        welcomeItem1: '• Crop recommendations based on your soil and climate',
        welcomeItem2: '• Farming best practices',
        welcomeItem3: '• Crop disease identification',
        welcomeItem4: '• Weather-based farming advice',
        welcomeItem5: '• General farming queries',
        welcomeClosing: 'How can I help you today?',
        
        // Quick Prompts
        prompt1: 'What crops are best for my area?',
        prompt2: 'How much water does rice need?',
        prompt3: 'Best crops for hot climate',
        prompt4: 'Suitable crops for clay soil',
        
        // Error Message
        errorMessage: 'Sorry, I encountered an error. Please try again or contact support if the issue persists.'
      },
      // Claim Modal
      claimModal: {
        title: 'GeoAI Insurance Claim',
        subtitle: 'Automated damage assessment with satellite verification',
        
        // Form Labels
        selectProperty: 'Select Property/Field',
        chooseProperty: 'Choose a property...',
        damageType: 'Type of Damage',
        estimatedDamage: 'Estimated Damage Percentage:',
        incidentDate: 'When did the damage occur?',
        description: 'Description (Optional)',
        descriptionPlaceholder: 'Provide additional details about the damage...',
        
        // Damage Types
        flood: 'Flood/Heavy Rain',
        drought: 'Drought/Heat',
        pest: 'Pest Attack',
        fire: 'Fire',
        storm: 'Storm/Cyclone',
        otherDamage: 'Other Damage',
        
        // Info Box
        geoaiTitle: 'GeoAI Verification',
        geoaiDescription: 'Your claim will be automatically verified using satellite imagery (NDVI analysis). This ensures fast and accurate processing without manual inspection. Typical processing time:',
        processingTime: '30-60 seconds',
        
        // Buttons
        submitClaim: 'Submit Claim for GeoAI Analysis',
        cancel: 'Cancel',
        close: 'Close',
        printReceipt: 'Print Receipt',
        
        // Processing Stage
        processingTitle: 'Processing Your Claim...',
        initializing: 'Initializing GeoAI system...',
        verifyingPolicy: 'Verifying policy status...',
        fetchingSatellite: 'Fetching satellite imagery...',
        analyzingNDVI: 'Analyzing NDVI data...',
        comparingBaseline: 'Comparing historical baseline...',
        fraudDetection: 'Running fraud detection...',
        calculatingDamage: 'Calculating damage assessment...',
        generatingReport: 'Generating claim report...',
        
        // Processing Steps
        satelliteData: 'Satellite Data',
        aiAnalysis: 'AI Analysis',
        verification: 'Verification',
        
        // Results
        claimApproved: 'Claim Approved!',
        claimId: 'Claim ID',
        processingTimeLabel: 'Processing Time',
        geoaiDamageScore: 'GeoAI Damage Score',
        estimatedPayout: 'Estimated Payout',
        
        // NDVI Evidence
        satelliteEvidence: 'Satellite Evidence (NDVI Analysis)',
        historicalNDVI: 'Historical NDVI (Healthy)',
        currentNDVI: 'Current NDVI (Damaged)',
        daysAgo: 'days ago',
        latestScan: 'Latest scan',
        
        // Next Steps
        nextSteps: 'Next Steps',
        step1Title: 'GeoAI Verification Complete',
        step1Desc: 'Satellite analysis passed',
        step2Title: 'Under Review',
        step2Desc: 'Insurance company verification (1-2 days)',
        step3Title: 'Payout Processing',
        step3Desc: 'Expected within 3-5 business days',
        
        // Validation Messages
        selectPropertyError: 'Please select a property',
        selectDamageError: 'Please select damage type',
        claimSuccess: 'Claim processed successfully!',
        claimFailed: 'Failed to process claim'
      },

      // Document Verification Modal
      docVerification: {
        title: 'OCR + AI Document Verification',
        subtitle: 'Automated verification with 85%+ accuracy',
        uploadTitle: 'Upload Land Document (7/12, Survey Doc, Land Records) *',
        clickUpload: 'Click to upload or drag and drop',
        fileTypes: 'JPG, PNG or PDF (max 10MB)',
        ownerName: 'Owner Name *',
        ownerPlaceholder: 'Enter full name as per document',
        surveyNumber: 'Survey Number / Gat Number *',
        surveyPlaceholder: 'e.g., 123/1A',
        area: 'Area (in hectares) *',
        areaPlaceholder: 'e.g., 2.5',
        village: 'Village',
        villagePlaceholder: 'Enter village name',
        district: 'District',
        districtPlaceholder: 'Enter district name',
        
        // Info Box
        howItWorks: 'How It Works',
        info1: 'AI extracts text from your document using OCR',
        info2: 'Compares extracted data with your input',
        info3: 'Auto-approves if match score > 85%',
        info4: 'No manual verification needed!',
        
        // Buttons
        startVerification: 'Start AI Verification',
        cancel: 'Cancel',
        close: 'Close',
        
        // Processing
        processingTitle: 'AI is Verifying Your Document...',
        uploading: 'Uploading document...',
        extracting: 'Extracting text using OCR...',
        processing: 'Processing document data...',
        validating: 'Validating with AI...',
        comparing: 'Comparing extracted data...',
        checkingDuplicates: 'Checking for duplicates...',
        generatingReport: 'Generating verification report...',
        
        // Results
        verified: 'Document Verified! ✅',
        needsReview: 'Needs Review ⚠️',
        failed: 'Verification Failed ❌',
        matchScore: 'Match Score',
        aiConfidence: 'AI Confidence',
        extractedFields: 'Extracted from Document (OCR)',
        fieldAnalysis: 'Field-by-Field Analysis',
        continueVerified: 'Continue with Verified Document',
        submitReview: 'Submit for Manual Review',
        tryAgain: 'Try Again',
        uploadDifferent: 'Upload Different Document',
        
        // Validation
        selectFile: 'Please select a document to verify',
        fillFields: 'Please fill all required fields',
        invalidFileType: 'Only JPG, PNG, and PDF files are allowed',
        fileTooLarge: 'File size must be less than 10MB',
        verificationFailed: 'Verification failed'
      },

      // Farm Todo
      farmTodo: {
        title: 'Farm Tasks',
        subtitle: 'Manage your daily activities',
        pending: 'Pending',
        completed: 'Completed',
        addTask: 'Add New Task',
        
        // Form
        taskTitle: 'Task title *',
        description: 'Description (optional)',
        lowPriority: '🟢 Low Priority',
        mediumPriority: '🟡 Medium Priority',
        highPriority: '🔴 High Priority',
        
        // Categories
        irrigation: '💧 Irrigation',
        fertilizer: '🌱 Fertilizer',
        pestControl: '🐛 Pest Control',
        harvesting: '🌾 Harvesting',
        planting: '🌿 Planting',
        maintenance: '🔧 Maintenance',
        other: '📋 Other',
        
        // Actions
        updateTask: 'Update Task',
        addTaskButton: 'Add Task',
        cancelButton: 'Cancel',
        deleteConfirm: 'Delete this task?',
        
        // Messages
        taskRequired: 'Task title is required',
        taskUpdated: 'Task updated!',
        taskAdded: 'Task added!',
        taskCompleted: '🎉 Task completed!',
        taskReopened: 'Task reopened',
        taskDeleted: 'Task deleted',
        failedLoad: 'Failed to load tasks',
        failedSave: 'Failed to save task',
        failedUpdate: 'Failed to update task',
        failedDelete: 'Failed to delete task',
        
        // Empty State
        noTasks: 'No tasks yet',
        addFirstTask: 'Add your first farm task!',
        loading: 'Loading tasks...'
      },

      // Footer
      footer: {
        brandDescription: 'Empowering farmers with AI-powered satellite monitoring, insurance integration, and smart farm management solutions for sustainable agriculture.',
        product: 'Product',
        features: 'Features',
        pricing: 'Pricing',
        documentation: 'Documentation',
        api: 'API',
        company: 'Company',
        aboutUs: 'About Us',
        team: 'Team',
        careers: 'Careers',
        blog: 'Blog',
        support: 'Support',
        helpCenter: 'Help Center',
        contact: 'Contact',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        copyright: 'FarmView AI. SSPU Hackathon Project. All rights reserved.',
        madeWithLove: 'Made with ❤️ for Indian Farmers'
      },

      // Header (Additional items not in nav)
      header: {
        login: 'Login',
        signUp: 'Sign Up',
        claims: 'Claims',
        aiAdvisor: 'AI Advisor'
      },

      // Insurance Claim Component
      insuranceClaim: {
        title: 'File Insurance Claim',
        checkingEligibility: 'Checking eligibility...',
        notEligible: 'Not Eligible',
        close: 'Close',
        activePolicy: 'Active Policy',
        policyNumber: 'Policy Number',
        coverage: 'Coverage',
        validUntil: 'Valid Until',
        damagePercentage: 'Damage Percentage',
        damageReason: 'Damage Reason',
        selectReason: '-- Select Reason --',
        description: 'Description',
        descriptionPlaceholder: 'Provide additional details...',
        geoaiVerification: 'GeoAI Verification',
        geoaiInfo: 'Your claim will be automatically verified using satellite imagery (NDVI analysis). This ensures fast and accurate processing without manual inspection.',
        fileClaim: 'File Claim',
        cancel: 'Cancel',
        processing: 'Processing...',
        claimApproved: 'Claim Approved!',
        claimFiled: 'Claim Filed!',
        claimId: 'Claim ID',
        status: 'Status',
        damageScore: 'Damage Score (GeoAI)',
        estimatedPayout: 'Estimated Payout',
        processingTime: 'Processing Time',
        geoaiEvidence: 'GeoAI Evidence',
        currentNDVI: 'Current NDVI',
        historicalNDVI: 'Historical NDVI',
        source: 'Source',
        sentinelSatellite: 'Sentinel-2 Satellite',
        selectReasonError: 'Please select damage reason'
      },

      // Satellite Components
      satellite: {
        satelliteAnalysis: 'Satellite Analysis',
        ndviHeatmap: 'NDVI Heatmap',
        sentinelImage: 'Sentinel Image',
        googleMapsSatellite: 'Google Maps Satellite',
        loading: 'Loading...',
        error: 'Error',
        fieldHealth: 'Field Health',
        healthyCoverage: 'Healthy Coverage',
        cropHealthIndicator: 'Crop Health Indicator',
        excellent: 'Excellent',
        good: 'Good',
        fair: 'Fair',
        poor: 'Poor',
        excellentMessage: 'Your crops are in excellent health!',
        goodMessage: 'Crops are doing well, monitor regularly',
        fairMessage: 'Some areas need attention',
        poorMessage: 'Urgent action required!',
        currentNDVI: 'Current NDVI',
        vegetationHealth: 'Vegetation Health',
        ndviRange: 'NDVI Range',
        stressedAreas: 'Stressed Areas',
        ndviColorScale: 'NDVI Color Scale',
        last30Days: 'Last 30 Days',
        whatIsNDVI: 'What is NDVI?',
        ndviDescription: 'NDVI (Normalized Difference Vegetation Index) measures plant health by analyzing how plants reflect near-infrared and red light. Values range from -1 to +1, where higher values indicate healthier, denser vegetation.',
        interpretation: 'Interpretation:',
        greenZones: 'Green zones: Healthy crops, good growth',
        yellowZones: 'Yellow zones: Moderate stress, monitor closely',
        brownZones: 'Brown zones: Bare soil or stressed crops',
        blueZones: 'Blue zones: Water bodies or very low vegetation',
        trueColorImage: 'True Color Satellite Image',
        imageDetails: 'Image Details',
        property: 'Property',
        resolution: 'Resolution',
        format: 'Format',
        source: 'Source',
        proTip: 'Pro Tip:',
        proTipMessage: 'Use NDVI analysis for accurate crop health assessment. The true color image is useful for visual inspection of field conditions.',
        googleMapsView: 'Google Maps Satellite View',
        googleMapsDescription: 'High-resolution satellite imagery powered by Google Maps',
        aboutGoogleMaps: 'About Google Maps View',
        googleMapsInfo: 'This interactive map uses Google Maps satellite imagery for better zoom levels and clarity. You can zoom in/out, switch map types, and explore the surrounding area of your field.',
        noDataLoaded: 'No satellite data loaded',
        clickToFetch: 'Click a button above to fetch satellite imagery or NDVI analysis',
        satellite: 'Satellite',
        hybrid: 'Hybrid',
        roadmap: 'Roadmap',
        zoom: 'Zoom'
      }
    }
  },
  hi: {
    translation: {
      nav: {
        dashboard: 'डैशबोर्ड',
        documents: 'दस्तावेज़',
        property: 'संपत्ति',
        insurance: 'बीमा',
        weather: 'मौसम',
        profile: 'प्रोफ़ाइल',
        logout: 'लॉग आउट'
      },
      auth: {
        login: 'लॉगिन',
        signup: 'साइन अप',
        email: 'ईमेल',
        password: 'पासवर्ड',
        name: 'पूरा नाम',
        mobile: 'मोबाइल नंबर',
        confirmPassword: 'पासवर्ड की पुष्टि करें',
        forgotPassword: 'पासवर्ड भूल गए?',
        dontHaveAccount: 'खाता नहीं है?',
        alreadyHaveAccount: 'पहले से खाता है?',
        loginSuccess: 'लॉगिन सफल!',
        signupSuccess: 'पंजीकरण सफल!',
        loginButton: 'साइन इन करें',
        signupButton: 'खाता बनाएं',
        
        // Login Page
        welcomeBack: 'वापसी पर स्वागत है',
        loginToManage: 'अपने खेत का प्रबंधन करने के लिए',
        emailOrMobile: 'या',
        enterEmailOrMobile: 'ईमेल या 10 अंकों का मोबाइल दर्ज करें',
        enterPassword: 'अपना पासवर्ड दर्ज करें',
        rememberMe: 'मुझे याद रखें',
        
        // Signup Page
        joinFarmview: 'FarmView AI में शामिल हों',
        createAccountDesc: 'अपना किसान खाता बनाएं और स्मार्ट खेती शुरू करें',
        enterFullName: 'अपना पूरा नाम दर्ज करें',
        emailPlaceholder: 'your.email@example.com',
        mobilePlaceholder: '10 अंकों का मोबाइल नंबर',
        preferredLanguage: 'पसंदीदा भाषा',
        passwordPlaceholder: 'न्यूनतम 6 वर्ण',
        confirmPasswordPlaceholder: 'पासवर्ड की पुष्टि करें',
        creatingAccount: 'खाता बनाया जा रहा है...',
        yourFarmerId: 'आपकी किसान आईडी:',
        
        // Demo Credentials
        demoCredentials: 'डेमो क्रेडेंशियल्स:',
        demoEmail: 'ईमेल: demo@farmview.com | पासवर्ड: demo123',
        
        // Validation Messages
        emailOrMobileRequired: 'ईमेल या मोबाइल नंबर आवश्यक है',
        passwordRequired: 'पासवर्ड आवश्यक है',
        passwordMinLength: 'पासवर्ड कम से कम 6 वर्णों का होना चाहिए',
        fixErrors: 'कृपया फॉर्म में त्रुटियां ठीक करें',
        nameRequired: 'नाम आवश्यक है',
        nameMinLength: 'नाम कम से कम 3 वर्णों का होना चाहिए',
        emailRequired: 'ईमेल आवश्यक है',
        emailInvalid: 'ईमेल अमान्य है',
        mobileRequired: 'मोबाइल नंबर आवश्यक है',
        mobileInvalid: 'मोबाइल 10 अंकों का होना चाहिए',
        passwordsNoMatch: 'पासवर्ड मेल नहीं खाते',
        loginFailed: 'लॉगिन विफल। कृपया अपनी साख की जांच करें।',
        signupFailed: 'साइनअप विफल। कृपया पुनः प्रयास करें।',
        welcomeBackUser: 'वापसी पर स्वागत है,'
      },
      dashboard: {
        welcome: 'स्वागत है',
        farmerId: 'किसान आईडी',
        totalProperties: 'कुल संपत्ति',
        activeInsurance: 'सक्रिय बीमा',
        documents: 'दस्तावेज़',
        weatherAlert: 'मौसम चेतावनी',
        recentActivity: 'हाल की गतिविधि',
        quickActions: 'त्वरित क्रियाएं',
        activeFarmer: 'सक्रिय किसान',
        status: 'स्थिति',
        active: 'सक्रिय',
        manageDocuments: 'दस्तावेज़ प्रबंधित करें',
        viewProperties: 'संपत्ति देखें',
        insurancePolicies: 'बीमा पॉलिसियाँ',
        weatherForecast: 'मौसम पूर्वानुमान',
        cropIntelligence: 'फसल बुद्धिमत्ता',
        aiCropAnalysis: 'AI-संचालित फसल विश्लेषण',
        startMessage: 'अपनी संपत्ति जोड़कर या दस्तावेज़ अपलोड करके शुरू करें'
      },
      common: {
        save: 'सहेजें',
        cancel: 'रद्द करें',
        delete: 'हटाएं',
        edit: 'संपादित करें',
        view: 'देखें',
        upload: 'अपलोड करें',
        download: 'डाउनलोड करें',
        submit: 'जमा करें',
        loading: 'लोड हो रहा है...',
        success: 'सफलता',
        error: 'त्रुटि',
        noData: 'कोई डेटा उपलब्ध नहीं',
        search: 'खोजें',
        filter: 'फ़िल्टर',
        actions: 'क्रियाएं'
      },
      documents: {
        title: 'मेरे दस्तावेज़',
        subtitle: 'अपने सभी कृषि संबंधी दस्तावेज़ों को सुरक्षित रूप से प्रबंधित करें',
        upload: 'दस्तावेज़ अपलोड करें',
        type: 'दस्तावेज़ प्रकार',
        name: 'दस्तावेज़ का नाम',
        category: 'श्रेणी',
        status: 'स्थिति',
        uploadedOn: 'अपलोड की तारीख',
        searchPlaceholder: 'दस्तावेज़ खोजें...',
        yourDocuments: 'आपके दस्तावेज़',
        noDocuments: 'अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया',
        noDocumentsDesc: 'शुरू करने के लिए अपना पहला दस्तावेज़ अपलोड करें',
        noSearchResults: 'कोई दस्तावेज़ नहीं मिला',
        tryDifferentSearch: 'कोई अन्य खोज शब्द आज़माएं',
        download: 'डाउनलोड करें',
        downloadStarted: 'डाउनलोड शुरू हो गया!',
        uploadSuccess: 'दस्तावेज़ सफलतापूर्वक अपलोड किया गया!',
        uploadFailed: 'अपलोड विफल',
        loadFailed: 'दस्तावेज़ लोड करने में विफल',
        downloadFailed: 'दस्तावेज़ डाउनलोड करने में विफल',
        selectFile: 'कृपया एक फ़ाइल चुनें',
        provideName: 'कृपया दस्तावेज़ का नाम प्रदान करें',
        
        // AI Verification Hindi
        aiVerification: 'AI दस्तावेज़ सत्यापन',
        aiSubtitle: 'स्वचालित धोखाधड़ी रोकथाम',
        howItWorks: 'यह कैसे काम करता है:',
        aiStep1: 'भूमि दस्तावेज़ अपलोड करें (7/12, सर्वेक्षण दस्तावेज़)',
        aiStep2: 'AI, OCR का उपयोग करके टेक्स्ट निकालता है',
        aiStep3: 'स्वचालित रूप से डेटा को मान्य करता है',
        aiStep4: 'यदि मिलान > 85% है तो स्वतः स्वीकृत करता है',
        aiStep5: 'मैनुअल सत्यापन की आवश्यकता नहीं!',
        startAIVerification: 'AI सत्यापन शुरू करें',
        aiVerified: 'AI सत्यापित',
        match: 'मिलान',
        
        // Manual Upload Hindi
        manualUpload: 'मैनुअल अपलोड',
        documentNameLabel: 'दस्तावेज़ का नाम *',
        documentNamePlaceholder: 'उदाहरण, भूमि स्वामित्व प्रमाणपत्र',
        documentTypeLabel: 'दस्तावेज़ का प्रकार *',
        dragDrop: 'फ़ाइल यहाँ खींचें और छोड़ें',
        or: 'या',
        browseFiles: 'फ़ाइलें ब्राउज़ करें',
        uploading: 'अपलोड हो रहा है...',
        uploadDocument: 'दस्तावेज़ अपलोड करें',
        
        // Document Types Hindi
        types: {
          panCard: 'पैन कार्ड',
          aadhaar: 'आधार कार्ड',
          landDocs: 'भूमि दस्तावेज़',
          insurance: 'बीमा पॉलिसी',
          bankPassbook: 'बैंक पासबुक',
          identity: 'पहचान',
          other: 'अन्य'
        },
        
        // Status Hindi
        statuses: {
          verified: 'सत्यापित',
          pending: 'लंबित',
          rejected: 'अस्वीकृत'
        }
      },
      property: {
        title: 'संपत्ति प्रबंधन',
        subtitle: 'अपनी कृषि संपत्तियां प्रबंधित करें और उपग्रह विश्लेषण देखें',
        myProperties: 'मेरी संपत्तियां',
        addProperty: 'नई संपत्ति जोड़ें',
        addNew: 'नई संपत्ति जोड़ें',
        noProperties: 'अभी तक कोई संपत्ति नहीं',
        noPropertiesDesc: 'नीचे अपनी पहली संपत्ति बनाकर शुरू करें',
        propertyDetails: 'संपत्ति विवरण',
        locationInfo: 'स्थान की जानकारी',
        cropInfo: 'फसल की जानकारी',
        addFirstProperty: 'अपनी पहली संपत्ति जोड़ें',
        
        // Property Card
        verified: 'सत्यापित',
        pendingVerification: 'सत्यापन लंबित',
        crop: 'फसल',
        area: 'क्षेत्रफल',
        soil: 'मिट्टी',
        irrigation: 'सिंचाई',
        notSpecified: 'निर्दिष्ट नहीं',
        documentsAttached: 'दस्तावेज़ संलग्न',
        viewSatellite: 'उपग्रह विश्लेषण देखें',
        
        // Form Fields
        propertyName: 'संपत्ति का नाम',
        propertyNamePlaceholder: 'उदा., उत्तर खेत, धान का खेत',
        searchLocation: 'स्थान खोजें',
        addressPlaceholder: 'पता टाइप करें (उदा., मुंबई, महाराष्ट्र)',
        searching: 'खोज रहे हैं...',
        search: 'खोजें',
        calculatedArea: 'गणना किया गया क्षेत्रफल',
        drawPolygon: 'मानचित्र पर बहुभुज बनाएं',
        drawOnMap: 'मानचित्र पर बनाएं',
        drawInstruction: 'संपत्ति की सीमा बनाने के लिए मानचित्र पर क्लिक करें',
        currentCrop: 'वर्तमान फसल',
        cropPlaceholder: 'उदा., गेहूं, चावल, कपास',
        cropHint: '{{count}}+ फसलों में से चुनें या खोजने के लिए टाइप करें',
        soilType: 'मिट्टी का प्रकार',
        irrigationType: 'सिंचाई का प्रकार',
        uploadDocuments: 'दस्तावेज़ अपलोड करें',
        propertyPapers: 'संपत्ति दस्तावेज़ (छवियाँ/PDF, अधिकतम 5)',
        dragDrop: 'फ़ाइलें यहाँ खींचें या ब्राउज़ करने के लिए क्लिक करें',
        maxFiles: 'अधिकतम 5 फ़ाइलें, प्रत्येक 5MB',
        
        // Soil Types
        soilTypes: {
          alluvial: 'जलोढ़',
          black: 'काली',
          red: 'लाल',
          laterite: 'लेटराइट',
          desert: 'रेगिस्तानी',
          mountain: 'पहाड़ी',
          other: 'अन्य'
        },
        
        // Irrigation Types
        irrigationTypes: {
          rainfed: 'वर्षा आधारित',
          drip: 'ड्रिप',
          sprinkler: 'स्प्रिंकलर',
          other: 'अन्य'
        },
        
        // Crop Recommendations
        getCropRecommendations: 'फसल सिफारिशें प्राप्त करें (1000+ फसलें)',
        gettingRecommendations: 'सिफारिशें प्राप्त हो रही हैं...',
        topRecommended: 'शीर्ष अनुशंसित फसलें',
        climate: 'जलवायु',
        bestMatches: 'सर्वोत्तम मिलान',
        cereals: 'अनाज',
        vegetables: 'सब्जियाँ',
        fruits: 'फल',
        spices: 'मसाले',
        analyzedCrops: '{{count}} फसलों का विश्लेषण किया गया • चयन करने के लिए किसी भी फसल पर क्लिक करें',
        
        // Document Verification
        documentVerified: 'दस्तावेज़ सत्यापित',
        match: 'मिलान',
        verifiedMessage: 'आपके दस्तावेज़ AI द्वारा सत्यापित किए गए हैं। अब आप अपनी संपत्ति सुरक्षित रूप से पंजीकृत कर सकते हैं।',
        noVerifiedDocs: 'कोई सत्यापित दस्तावेज़ नहीं',
        recommendVerification: 'हम धोखाधड़ी रोकथाम के लिए AI का उपयोग करके आपके भूमि दस्तावेज़ों को सत्यापित करने की सलाह देते हैं।',
        verifyNow: 'अभी दस्तावेज़ सत्यापित करें',
        
        // Alerts and Confirmations
        drawBoundaryAlert: 'कृपया मानचित्र पर अपने खेत की सीमा बनाएं',
        noVerifiedDocsConfirm: '⚠️ कोई सत्यापित दस्तावेज़ नहीं मिला!\n\nधोखाधड़ी रोकथाम के लिए, हम दस्तावेज़ पृष्ठ में AI सत्यापन का उपयोग करके आपके भूमि दस्तावेज़ों को सत्यापित करने की सलाह देते हैं।\n\nक्या आप बिना सत्यापन के आगे बढ़ना चाहते हैं?',
        verifyFirstAlert: 'कृपया पहले दस्तावेज़ पृष्ठ से अपने दस्तावेज़ सत्यापित करें।',
        oldVerificationConfirm: '⚠️ आपका दस्तावेज़ सत्यापन 24 घंटे से अधिक पुराना है।\n\nहम सुरक्षा के लिए आपके दस्तावेज़ों को फिर से सत्यापित करने की सलाह देते हैं।\n\nक्या आप वैसे भी आगे बढ़ना चाहते हैं?',
        reverifyAlert: 'कृपया दस्तावेज़ पृष्ठ से अपने दस्तावेज़ों को फिर से सत्यापित करें।',
        registeredSuccess: '✅ संपत्ति सफलतापूर्वक पंजीकृत हुई!',
        createFailed: 'संपत्ति बनाने में विफल',
        
        // Actions
        submitProperty: 'संपत्ति जमा करें',
        createProperty: 'संपत्ति बनाएं',
        submitting: 'जमा हो रहा है...',
        cancel: 'रद्द करें',
        viewDetails: 'विवरण देखें',
        analyzeSatellite: 'उपग्रह विश्लेषण',
        getRecommendations: 'सिफारिशें प्राप्त करें',
        aiVerify: 'AI सत्यापन',
        verifying: 'सत्यापित हो रहा है...',
        verified: 'सत्यापित',
        delete: 'हटाएं',
        deleting: 'हटाया जा रहा है...',
        edit: 'संपादित करें',
        
        // Messages
        propertyAdded: 'संपत्ति सफलतापूर्वक जोड़ी गई!',
        propertyAddFailed: 'संपत्ति जोड़ने में विफल',
        propertiesLoadFailed: 'संपत्तियां लोड करने में विफल',
        drawBoundary: 'कृपया मानचित्र पर संपत्ति की सीमा बनाएं',
        locationNotFound: 'स्थान नहीं मिला',
        propertyDeleted: 'संपत्ति सफलतापूर्वक हटाई गई!',
        deleteFailed: 'संपत्ति हटाने में विफल',
        
        // Recommendations
        cropRecommendations: 'फसल सिफारिशें',
        loadingRecommendations: 'सिफारिशें लोड हो रही हैं...',
        recommendedCrops: 'अनुशंसित फसलें',
        basedOn: 'आपकी संपत्ति की स्थितियों के आधार पर',
        noRecommendations: 'कोई सिफारिश उपलब्ध नहीं',
        tryAgain: 'पुनः प्रयास करें'
      },
      insurance: {
        title: 'बीमा पॉलिसी',
        subtitle: 'अपने खेत की बीमा कवरेज प्रबंधित करें',
        addNewPolicy: 'नई पॉलिसी जोड़ें',
        createNewPolicy: 'नई पॉलिसी बनाएं',
        yourPolicies: 'आपकी पॉलिसी',
        noPolicies: 'अभी तक कोई बीमा पॉलिसी नहीं',
        noPoliciesDesc: 'व्यापक बीमा कवरेज के साथ अपने खेत को सुरक्षित करें',
        addFirstPolicy: 'अपनी पहली पॉलिसी जोड़ें',
        viewDetails: 'विवरण देखें',
        fileClaim: 'दावा दायर करें',
        
        // Form Fields
        policyNumber: 'पॉलिसी नंबर',
        policyNumberPlaceholder: 'उदा., CROP-2025-001234',
        policyType: 'पॉलिसी का प्रकार',
        providerName: 'बीमा प्रदाता का नाम',
        providerNamePlaceholder: 'उदा., कृषि बीमा कंपनी',
        providerContact: 'प्रदाता संपर्क',
        providerContactPlaceholder: 'उदा., +91 9876543210',
        providerEmail: 'प्रदाता ईमेल',
        providerEmailPlaceholder: 'उदा., support@insurance.com',
        coverageAmount: 'कवरेज राशि (₹)',
        coverageAmountPlaceholder: 'उदा., 500000',
        premiumAmount: 'प्रीमियम राशि (₹)',
        premiumAmountPlaceholder: 'उदा., 15000',
        premiumFrequency: 'प्रीमियम आवृत्ति',
        propertyId: 'संपत्ति आईडी (वैकल्पिक)',
        propertyIdPlaceholder: 'संपत्ति से लिंक करें',
        startDate: 'प्रारंभ तिथि',
        endDate: 'समाप्ति तिथि',
        required: '*',
        
        // Policy Types
        cropInsurance: 'फसल बीमा',
        weatherBased: 'मौसम आधारित बीमा',
        livestock: 'पशुधन बीमा',
        farmEquipment: 'कृषि उपकरण बीमा',
        multiPeril: 'बहु-जोखिम फसल बीमा',
        other: 'अन्य',
        
        // Premium Frequencies
        annual: 'वार्षिक',
        semiAnnual: 'अर्ध-वार्षिक',
        quarterly: 'त्रैमासिक',
        oneTime: 'एक बार',
        
        // Statuses
        active: 'सक्रिय',
        pending: 'लंबित',
        expired: 'समाप्त',
        
        // Actions
        createPolicy: 'पॉलिसी बनाएं',
        creating: 'बनाया जा रहा है...',
        cancel: 'रद्द करें',
        
        // Policy Details
        type: 'प्रकार',
        coverage: 'कवरेज',
        premium: 'प्रीमियम',
        valid: 'वैध',
        year: 'वर्ष',
        
        // Messages
        fillRequired: 'कृपया सभी आवश्यक फ़ील्ड भरें',
        createSuccess: 'बीमा पॉलिसी बनाई गई!',
        createFailed: 'पॉलिसी बनाने में विफल',
        loadFailed: 'पॉलिसी लोड करने में विफल'
      },
      weather: {
        title: 'मौसम',
        current: 'वर्तमान मौसम',
        forecast: 'पूर्वानुमान',
        temperature: 'तापमान',
        humidity: 'आर्द्रता',
        windSpeed: 'हवा की गति',
        rainfall: 'बारिश'
      },
      // Claims Hindi
      claims: {
        title: 'बीमा दावे',
        subtitle: 'अपने GeoAI सत्यापित बीमा दावों को ट्रैक करें',
        approved: 'स्वीकृत',
        processing: 'प्रसंस्करण',
        underReview: 'समीक्षाधीन',
        rejected: 'अस्वीकृत',
        paid: 'भुगतान किया गया',
        noClaims: 'अभी तक कोई दावा नहीं',
        noClaimsDesc: 'आपने अभी तक कोई बीमा दावा दायर नहीं किया है',
        fileFirstClaim: 'अपना पहला दावा दायर करें',
        filedOn: 'दायर किया गया',
        estimatedPayout: 'अनुमानित भुगतान',
        property: 'संपत्ति',
        geoaiAssessment: 'GeoAI आकलन',
        processingLabel: 'प्रसंस्करण',
        geoaiVerified: 'GeoAI सत्यापित',
        damageReason: 'क्षति का कारण',
        notSpecified: 'निर्दिष्ट नहीं',
        payoutIn: '3-5 दिनों में भुगतान',
        underReviewText: 'समीक्षाधीन',
        viewFullReport: 'पूरी रिपोर्ट देखें',
        downloadPDF: 'PDF डाउनलोड करें',
        claimDetails: 'दावा विवरण',
        fullReportComing: 'पूर्ण दावा रिपोर्ट जल्द आ रही है...',
        satelliteEvidence: 'सैटेलाइट साक्ष्य (NDVI)',
        historical: 'ऐतिहासिक (स्वस्थ)',
        current: 'वर्तमान (क्षतिग्रस्त)',
        aboutGeoai: 'GeoAI सत्यापन के बारे में',
        geoaiDescription: 'सभी दावों को Sentinel-2 सैटेलाइट इमेजरी और NDVI विश्लेषण का उपयोग करके स्वचालित रूप से सत्यापित किया जाता है। हमारी AI प्रणाली क्षति का सटीक आकलन करने और संभावित धोखाधड़ी का पता लगाने के लिए वर्तमान फसल स्वास्थ्य की ऐतिहासिक आधार रेखाओं से तुलना करती है। यह मैनुअल फील्ड निरीक्षण के बिना निष्पक्ष और तेज दावा प्रसंस्करण सुनिश्चित करता है।'
      },
      // Field Advisor Hindi
      fieldAdvisor: {
        title: 'अपनी फील्ड को जानें - AI सलाहकार',
        subtitle: 'अपनी विशिष्ट फील्ड के लिए AI द्वारा संचालित व्यक्तिगत कृषि सलाह प्राप्त करें',
        selectField: 'शुरू करने के लिए एक फील्ड चुनें',
        noProperties: 'आपके पास अभी तक कोई संपत्ति नहीं है।',
        addFirstProperty: 'अपनी पहली संपत्ति जोड़ें',
        loadFailed: 'आपकी संपत्तियां लोड करने में विफल',
        aiError: 'AI प्रतिक्रिया प्राप्त करने में विफल',
        changeField: 'फील्ड बदलें',
        chatAboutField: 'इस फील्ड के बारे में चैट करें →',
        
        // Field Info Hindi
        verifiedProperty: 'सत्यापित संपत्ति',
        currentCrop: 'वर्तमान फसल',
        area: 'क्षेत्रफल',
        soilType: 'मिट्टी का प्रकार',
        irrigation: 'सिंचाई',
        notSpecified: 'निर्दिष्ट नहीं',
        hectares: 'हेक्टेयर',
        
        // Chat Hindi
        aiAdvisor: 'AI सलाहकार',
        aiThinking: 'AI सोच रहा है...',
        relatedTopics: 'संबंधित विषय:',
        quickQuestions: 'त्वरित प्रश्न:',
        askPlaceholder: 'अपनी फील्ड के बारे में कुछ भी पूछें... (भेजने के लिए Enter दबाएं)',
        tipMessage: '💡 सुझाव: विशिष्ट रहें! बेहतर सलाह के लिए अपनी चिंताओं, अवलोकनों या लक्ष्यों का उल्लेख करें।',
        errorMessage: '❌ क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें या अपने प्रश्न को दोबारा लिखें।',
        
        // Welcome Message Hindi
        welcomeHello: 'नमस्ते! 🌾 मैं आपका AI फील्ड सलाहकार हूँ',
        welcomeCanHelp: 'मैं आपकी मदद कर सकता हूं:',
        welcomeItem1: '🌱 फसल सिफारिशें और सर्वोत्तम प्रथाएं',
        welcomeItem2: '🌦️ मौसम आधारित कृषि सलाह',
        welcomeItem3: '💧 सिंचाई और मिट्टी प्रबंधन',
        welcomeItem4: '🐛 कीट और रोग रोकथाम',
        welcomeItem5: '📈 उपज अनुकूलन रणनीतियां',
        welcomeClosing: 'अपनी फील्ड के बारे में मुझसे कुछ भी पूछने के लिए स्वतंत्र महसूस करें!',
        
        // Quick Questions Hindi
        questions: {
          weather: 'मौसम के आधार पर रोपण का सबसे अच्छा समय क्या है?',
          water: 'मेरी फसल को कितने पानी की आवश्यकता है?',
          pests: 'मेरी फसल के लिए आम कीट कौन से हैं?',
          soil: 'मैं अपनी मिट्टी की गुणवत्ता कैसे सुधार सकता हूं?',
          yield: 'फसल की उपज बढ़ाने के लिए सुझाव?',
          diseases: 'मुझे किन बीमारियों के लिए सावधान रहना चाहिए?'
        }
      },
      // Crop Intelligence Hindi
      cropIntel: {
        title: 'फसल बुद्धिमत्ता डैशबोर्ड',
        subtitle: 'सैटेलाइट डेटा और NDVI का उपयोग करके AI-संचालित फसल विश्लेषण',
        backButton: 'वापस',
        selectProperty: 'संपत्ति चुनें',
        available: 'उपलब्ध',
        propertySelected: 'संपत्ति चयनित',
        noProperties: 'कोई संपत्ति नहीं मिली',
        noPropertiesDesc: 'फसल बुद्धिमत्ता सुविधाओं का उपयोग करने से पहले आपको एक संपत्ति जोड़नी होगी।',
        addProperty: 'संपत्ति जोड़ें',
        backToDashboard: 'डैशबोर्ड पर वापस जाएं',
        loadingProperties: 'संपत्तियां लोड हो रही हैं...',
        
        // Tabs Hindi
        tabs: {
          analyze: 'विश्लेषण',
          identify: 'फसल पहचानें',
          recommend: 'सिफारिश',
          issues: 'स्वास्थ्य जांच',
          yield: 'उपज की भविष्यवाणी',
          ndvi: 'NDVI आंकड़े'
        },
        
        // Analyze Tab Hindi
        analyze: {
          title: 'व्यापक फसल विश्लेषण',
          button: 'फसल का विश्लेषण करें',
          analyzing: 'विश्लेषण हो रहा है...',
          cropIdentification: 'फसल पहचान',
          confidence: 'आत्मविश्वास',
          healthAssessment: 'स्वास्थ्य मूल्यांकन',
          overallHealth: 'समग्र स्वास्थ्य',
          healthScore: 'स्वास्थ्य स्कोर',
          detectedIssues: 'पता लगाई गई समस्याएं',
          issue: 'समस्या',
          severity: 'गंभीरता',
          action: 'कार्रवाई',
          cropRecommendation: 'अगली फसल की सिफारिश',
          actionableInsights: 'कार्रवाई योग्य अंतर्दृष्टि'
        },
        
        // Identify Tab Hindi
        identify: {
          title: 'फसल का प्रकार पहचानें',
          button: 'फसल की पहचान करें',
          identifying: 'पहचान हो रही है...',
          sure: 'निश्चित',
          whyThisCrop: 'यह फसल क्यों?',
          couldAlsoBe: 'यह भी हो सकता है:',
          pattern: 'पैटर्न',
          ndviSignature: 'NDVI हस्ताक्षर',
          seasonMatch: 'मौसम मिलान'
        },
        
        // Recommend Tab Hindi
        recommend: {
          title: 'अगली फसल की सिफारिश',
          button: 'सिफारिश प्राप्त करें',
          analyzing: 'विश्लेषण हो रहा है...',
          expectedYield: 'अपेक्षित उपज',
          profitability: 'लाभप्रदता',
          roi: 'ROI',
          whyThisCrop: 'यह फसल क्यों?',
          soilPreparation: 'मिट्टी तैयारी के चरण',
          waterRequirement: 'पानी की आवश्यकता',
          bestPlantingTime: 'सर्वोत्तम रोपण समय',
          riskFactors: 'जोखिम कारक'
        },
        
        // Issues Tab Hindi
        issues: {
          title: 'फसल स्वास्थ्य जांच',
          button: 'समस्याओं के लिए स्कैन करें',
          scanning: 'स्कैन हो रहा है...',
          healthStatus: 'स्वास्थ्य स्थिति',
          detectedIssues: 'पता लगाई गई समस्याएं',
          symptoms: 'लक्षण',
          recommendedActions: 'अनुशंसित कार्रवाई',
          priority: 'प्राथमिकता',
          timing: 'समय',
          cost: 'लागत',
          benefit: 'लाभ',
          noIssuesTitle: 'कोई समस्या नहीं मिली!',
          noIssuesDesc: 'आपकी फसल स्वस्थ है और अच्छी तरह से बढ़ रही है।',
          monitoringAdvice: 'निगरानी सलाह',
          yieldImpact: 'संभावित उपज प्रभाव',
          affectedArea: 'प्रभावित क्षेत्र',
          location: 'स्थान',
          urgency: 'तात्कालिकता'
        },
        
        // Yield Tab Hindi
        yield: {
          title: 'उपज पूर्वानुमान',
          button: 'उपज की भविष्यवाणी करें',
          predicting: 'भविष्यवाणी हो रही है...',
          expectedYield: 'अपेक्षित उपज',
          range: 'सीमा',
          confidenceLevel: 'आत्मविश्वास',
          positiveFactors: 'सकारात्मक कारक',
          challenges: 'चुनौतियां',
          comparison: 'तुलना',
          vsAverage: 'बनाम औसत',
          vsPotential: 'बनाम संभावित',
          vsLastYear: 'बनाम पिछले वर्ष',
          bestHarvestTime: 'सर्वोत्तम कटाई का समय',
          qualityExpectation: 'गुणवत्ता अपेक्षा',
          howToImprove: 'उपज कैसे सुधारें'
        },
        
        // NDVI Tab Hindi
        ndvi: {
          title: 'NDVI आंकड़े',
          button: 'NDVI डेटा प्राप्त करें',
          loading: 'लोड हो रहा है...',
          meanNDVI: 'औसत NDVI',
          median: 'माध्यिका',
          min: 'न्यूनतम',
          max: 'अधिकतम',
          vegetationDistribution: 'वनस्पति वितरण',
          healthy: 'स्वस्थ (NDVI > 0.6)',
          moderate: 'मध्यम (0.3-0.6)',
          stressed: 'तनावग्रस्त (0-0.3)',
          bare: 'नंगी/पानी (< 0)',
          status: 'स्थिति',
          ndviGuide: 'NDVI गाइड',
          dataQuality: 'डेटा गुणवत्ता',
          totalPixels: 'कुल पिक्सेल',
          validPixels: 'वैध पिक्सेल',
          healthyPixels: 'स्वस्थ पिक्सेल',
          stressedPixels: 'तनावग्रस्त पिक्सेल'
        }
      },
      // Landing Page Hindi
      landing: {
        heroTitle: 'स्मार्ट खेती',
        heroTitleHighlight: 'AI तकनीक के साथ',
        heroSubtitle: 'सैटेलाइट-आधारित फसल निगरानी, GeoAI सत्यापन के साथ स्वचालित बीमा दावे, और एक शक्तिशाली प्लेटफॉर्म में पूर्ण कृषि प्रबंधन',
        getStartedFree: 'मुफ्त शुरू करें',
        loginToDashboard: 'डैशबोर्ड में लॉगिन करें',
        geoaiBadge: 'अब GeoAI बीमा दावों के साथ',
        benefits: {
          satellite: 'आपकी फसलों की रीयल-टाइम सैटेलाइट निगरानी',
          claims: 'स्वचालित बीमा दावा प्रसंस्करण',
          weather: 'आपके स्थान के लिए अनुकूलित मौसम पूर्वानुमान',
          documents: 'सुरक्षित दस्तावेज़ प्रबंधन प्रणाली',
          multilang: 'किसानों के लिए बहु-भाषा समर्थन',
          ai: 'AI-संचालित फसल स्वास्थ्य विश्लेषण'
        },
        stats: {
          farmers: 'पंजीकृत किसान',
          hectares: 'हेक्टेयर निगरानी',
          claims: 'दावे संसाधित',
          uptime: 'अपटाइम गारंटी'
        },
        features: {
          title: 'सफलता के लिए आवश्यक सब कुछ',
          subtitle: 'आधुनिक भारतीय किसानों के लिए विशेष रूप से डिज़ाइन किए गए व्यापक उपकरण',
          property: {
            title: 'संपत्ति प्रबंधन',
            desc: 'इंटरैक्टिव मानचित्र पर अपनी खेत की सीमाओं को बनाएं और प्रबंधित करें'
          },
          documents: {
            title: 'दस्तावेज़ प्रबंधन',
            desc: 'अपने सभी कृषि दस्तावेज़ों को सुरक्षित रूप से संग्रहीत और प्रबंधित करें'
          },
          insurance: {
            title: 'बीमा एकीकरण',
            desc: 'पॉलिसी प्रबंधित करें और आसानी से दावे जमा करें'
          },
          weather: {
            title: 'मौसम पूर्वानुमान',
            desc: 'अपने स्थान के लिए रीयल-टाइम मौसम अपडेट प्राप्त करें'
          },
          monitoring: {
            title: 'फसल निगरानी',
            desc: 'सैटेलाइट-आधारित फसल स्वास्थ्य विश्लेषण'
          },
          smart: {
            title: 'स्मार्ट खेती',
            desc: 'बेहतर उपज के लिए AI-संचालित अंतर्दृष्टि'
          }
        },
        cta: {
          title: 'अपनी खेती को बदलने के लिए तैयार हैं?',
          subtitle: 'हजारों किसान पहले से ही उपज बढ़ाने और अपने निवेश की रक्षा के लिए FarmView AI का उपयोग कर रहे हैं',
          createAccount: 'मुफ्त खाता बनाएं',
          learnMore: 'और जानें'
        }
      },
      // Profile Hindi
      profile: {
        title: 'मेरी प्रोफ़ाइल',
        subtitle: 'अपने खाते की सेटिंग प्रबंधित करें',
        personalInfo: 'व्यक्तिगत जानकारी',
        securitySettings: 'सुरक्षा सेटिंग्स',
        languageSettings: 'भाषा सेटिंग्स',
        editProfile: 'प्रोफ़ाइल संपादित करें',
        saveChanges: 'परिवर्तन सहेजें',
        cancel: 'रद्द करें',
        uploadPicture: 'तस्वीर अपलोड करें',
        deletePicture: 'तस्वीर हटाएं',
        changePassword: 'पासवर्ड बदलें',
        updatePassword: 'पासवर्ड अपडेट करें',
        
        // Fields
        farmerId: 'किसान आईडी',
        fullName: 'पूरा नाम',
        email: 'ईमेल पता',
        mobile: 'मोबाइल नंबर',
        address: 'पता',
        memberSince: 'सदस्य बने',
        accountStatus: 'खाता स्थिति',
        preferredLanguage: 'पसंदीदा भाषा',
        currentPassword: 'वर्तमान पासवर्ड',
        newPassword: 'नया पासवर्ड',
        confirmNewPassword: 'नए पासवर्ड की पुष्टि करें',
        
        // Placeholders
        enterName: 'अपना पूरा नाम दर्ज करें',
        enterEmail: 'अपना ईमेल दर्ज करें',
        enterMobile: 'अपना मोबाइल नंबर दर्ज करें',
        enterAddress: 'अपना पता दर्ज करें',
        enterCurrentPassword: 'वर्तमान पासवर्ड दर्ज करें',
        enterNewPassword: 'नया पासवर्ड दर्ज करें',
        confirmPasswordPlaceholder: 'नए पासवर्ड की पुष्टि करें',
        
        // Messages
        profileUpdated: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!',
        profileUpdateFailed: 'प्रोफ़ाइल अपडेट करने में विफल',
        passwordUpdated: 'पासवर्ड सफलतापूर्वक अपडेट हो गया!',
        passwordUpdateFailed: 'पासवर्ड अपडेट करने में विफल',
        pictureUploaded: 'प्रोफ़ाइल फ़ोटो अपलोड हो गई!',
        pictureUploadFailed: 'फ़ोटो अपलोड करने में विफल',
        pictureDeleted: 'प्रोफ़ाइल फ़ोटो हटा दी गई!',
        pictureDeleteFailed: 'फ़ोटो हटाने में विफल',
        
        // Validation
        nameRequired: 'नाम आवश्यक है',
        nameMinLength: 'नाम कम से कम 3 वर्णों का होना चाहिए',
        emailRequired: 'ईमेल आवश्यक है',
        emailInvalid: 'ईमेल अमान्य है',
        mobileRequired: 'मोबाइल नंबर आवश्यक है',
        mobileInvalid: 'मोबाइल 10 अंकों का होना चाहिए',
        currentPasswordRequired: 'वर्तमान पासवर्ड आवश्यक है',
        newPasswordRequired: 'नया पासवर्ड आवश्यक है',
        newPasswordMinLength: 'पासवर्ड कम से कम 6 वर्णों का होना चाहिए',
        passwordsNoMatch: 'पासवर्ड मेल नहीं खाते',
        fixErrors: 'कृपया फॉर्म में त्रुटियां ठीक करें'
      },
      // Property Hindi
      property: {
        title: 'मेरी संपत्तियां',
        subtitle: 'अपनी कृषि संपत्तियां प्रबंधित करें',
        addProperty: 'नई संपत्ति जोड़ें',
        noProperties: 'कोई संपत्ति नहीं मिली',
        noPropertiesDesc: 'शुरू करने के लिए अपनी पहली संपत्ति जोड़ें',
        propertyDetails: 'संपत्ति विवरण',
        locationInfo: 'स्थान जानकारी',
        cropInfo: 'फसल जानकारी',
        addFirstProperty: 'अपनी पहली संपत्ति जोड़ें',
        
        // Form Fields
        propertyName: 'संपत्ति का नाम',
        propertyNamePlaceholder: 'उदा., उत्तरी खेत',
        searchLocation: 'स्थान खोजें',
        searchPlaceholder: 'पता या स्थान का नाम दर्ज करें',
        searching: 'खोज रहा है...',
        drawOnMap: 'मानचित्र पर बनाएं',
        drawInstruction: 'अपनी संपत्ति की सीमा बनाने के लिए मानचित्र पर क्लिक करें',
        area: 'क्षेत्रफल',
        currentCrop: 'वर्तमान फसल',
        currentCropPlaceholder: 'उदा., गेहूं, चावल, कपास',
        soilType: 'मिट्टी का प्रकार',
        irrigationType: 'सिंचाई का प्रकार',
        uploadDocuments: 'दस्तावेज़ अपलोड करें',
        dragDrop: 'फ़ाइलें यहां खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें',
        maxFiles: 'अधिकतम 5 फ़ाइलें, प्रत्येक 5MB',
        
        // Soil Types
        alluvial: 'जलोढ़',
        black: 'काली (रेगुर)',
        red: 'लाल',
        laterite: 'लैटेराइट',
        desert: 'रेगिस्तानी',
        mountain: 'पर्वतीय',
        
        // Irrigation Types
        rainfed: 'वर्षा आधारित',
        drip: 'ड्रिप सिंचाई',
        sprinkler: 'स्प्रिंकलर',
        flood: 'बाढ़ सिंचाई',
        
        // Actions
        submitProperty: 'संपत्ति सबमिट करें',
        submitting: 'सबमिट हो रहा है...',
        cancel: 'रद्द करें',
        viewDetails: 'विवरण देखें',
        analyzeSatellite: 'सैटेलाइट विश्लेषण',
        getRecommendations: 'सिफारिशें प्राप्त करें',
        
        // Messages
        propertyAdded: 'संपत्ति सफलतापूर्वक जोड़ी गई!',
        propertyAddFailed: 'संपत्ति जोड़ने में विफल',
        propertiesLoadFailed: 'संपत्तियां लोड करने में विफल',
        drawBoundary: 'कृपया मानचित्र पर संपत्ति की सीमा बनाएं',
        locationNotFound: 'स्थान नहीं मिला',
        
        // Recommendations
        cropRecommendations: 'फसल सिफारिशें',
        loadingRecommendations: 'सिफारिशें लोड हो रही हैं...',
        recommendedCrops: 'अनुशंसित फसलें',
        basedOn: 'आपकी संपत्ति की स्थितियों के आधार पर',
        noRecommendations: 'कोई सिफारिश उपलब्ध नहीं',
        tryAgain: 'पुनः प्रयास करें'
      },
      // Weather Hindi
      weather: {
        title: 'मौसम निगरानी',
        subtitle: 'वास्तविक समय मौसम और AI पूर्वानुमान',
        yourProperties: 'आपकी संपत्तियां',
        noProperties: 'कोई संपत्ति नहीं मिली',
        addPropertyFirst: 'पहले एक संपत्ति जोड़ें',
        selectProperty: 'मौसम देखने के लिए एक संपत्ति चुनें',
        chooseProperty: 'अपनी संपत्तियों में से चुनें',
        
        // Current Weather
        temperature: 'तापमान',
        humidity: 'आर्द्रता',
        wind: 'हवा',
        pressure: 'दबाव',
        weatherDescription: 'मौसम विवरण',
        
        // AI Prediction
        aiPrediction: 'AI फसल पूर्वानुमान',
        runPrediction: 'पूर्वानुमान चलाएं',
        predicting: 'पूर्वानुमान हो रहा है...',
        predictionResults: 'पूर्वानुमान परिणाम',
        clickToAnalyze: 'स्थितियों का विश्लेषण करने के लिए "पूर्वानुमान चलाएं" पर क्लिक करें',
        mlInsights: 'ML-संचालित कृषि अंतर्दृष्टि',
        
        // Messages
        weatherLoaded: 'मौसम लोड हो गया!',
        weatherLoadFailed: 'मौसम लाने में विफल',
        predictionComplete: 'ML पूर्वानुमान पूरा हुआ!',
        predictionFailed: 'पूर्वानुमान विफल',
        selectPropertyFirst: 'पहले संपत्ति चुनें और मौसम लोड करें',
        propertiesLoadFailed: 'संपत्तियां लोड करने में विफल'
      },
      // AI Chatbot Hindi
      chatbot: {
        title: 'FarmView AI',
        subtitle: 'फसलों, मौसम और अधिक के बारे में पूछें!',
        aiAssistant: 'AI सहायक',
        placeholder: 'फसलों, खेती, मौसम के बारे में पूछें...',
        disclaimer: 'AI गलतियाँ कर सकता है। महत्वपूर्ण जानकारी की पुष्टि करें।',
        quickQuestions: 'त्वरित प्रश्न:',
        
        // Welcome Message
        welcomeTitle: 'नमस्ते! मैं आपका FarmView AI सहायक हूं।',
        welcomeHelp: 'मैं आपकी मदद कर सकता हूं:',
        welcomeItem1: '• आपकी मिट्टी और जलवायु के आधार पर फसल सिफारिशें',
        welcomeItem2: '• खेती के सर्वोत्तम अभ्यास',
        welcomeItem3: '• फसल रोग पहचान',
        welcomeItem4: '• मौसम आधारित खेती सलाह',
        welcomeItem5: '• सामान्य खेती प्रश्न',
        welcomeClosing: 'आज मैं आपकी कैसे मदद कर सकता हूं?',
        
        // Quick Prompts
        prompt1: 'मेरे क्षेत्र के लिए कौन सी फसलें सबसे अच्छी हैं?',
        prompt2: 'चावल को कितने पानी की आवश्यकता है?',
        prompt3: 'गर्म जलवायु के लिए सर्वोत्तम फसलें',
        prompt4: 'मिट्टी की मिट्टी के लिए उपयुक्त फसलें',
        
        // Error Message
        errorMessage: 'क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें या यदि समस्या बनी रहती है तो सहायता से संपर्क करें।'
      },
      // Claim Modal Hindi
      claimModal: {
        title: 'GeoAI बीमा दावा',
        subtitle: 'सैटेलाइट सत्यापन के साथ स्वचालित क्षति मूल्यांकन',
        
        // Form Labels
        selectProperty: 'संपत्ति/खेत चुनें',
        chooseProperty: 'एक संपत्ति चुनें...',
        damageType: 'क्षति का प्रकार',
        estimatedDamage: 'अनुमानित क्षति प्रतिशत:',
        incidentDate: 'क्षति कब हुई?',
        description: 'विवरण (वैकल्पिक)',
        descriptionPlaceholder: 'क्षति के बारे में अतिरिक्त विवरण प्रदान करें...',
        
        // Damage Types
        flood: 'बाढ़/भारी बारिश',
        drought: 'सूखा/गर्मी',
        pest: 'कीट हमला',
        fire: 'आग',
        storm: 'तूफान/चक्रवात',
        otherDamage: 'अन्य क्षति',
        
        // Info Box
        geoaiTitle: 'GeoAI सत्यापन',
        geoaiDescription: 'आपके दावे को सैटेलाइट इमेजरी (NDVI विश्लेषण) का उपयोग करके स्वचालित रूप से सत्यापित किया जाएगा। यह मैनुअल निरीक्षण के बिना तेज और सटीक प्रसंस्करण सुनिश्चित करता है। विशिष्ट प्रसंस्करण समय:',
        processingTime: '30-60 सेकंड',
        
        // Buttons
        submitClaim: 'GeoAI विश्लेषण के लिए दावा सबमिट करें',
        cancel: 'रद्द करें',
        close: 'बंद करें',
        printReceipt: 'रसीद प्रिंट करें',
        
        // Processing Stage
        processingTitle: 'आपके दावे को संसाधित किया जा रहा है...',
        initializing: 'GeoAI प्रणाली प्रारंभ हो रही है...',
        verifyingPolicy: 'पॉलिसी स्थिति सत्यापित की जा रही है...',
        fetchingSatellite: 'सैटेलाइट इमेजरी प्राप्त की जा रही है...',
        analyzingNDVI: 'NDVI डेटा का विश्लेषण किया जा रहा है...',
        comparingBaseline: 'ऐतिहासिक आधार रेखा से तुलना की जा रही है...',
        fraudDetection: 'धोखाधड़ी का पता लगाया जा रहा है...',
        calculatingDamage: 'क्षति मूल्यांकन की गणना की जा रही है...',
        generatingReport: 'दावा रिपोर्ट तैयार की जा रही है...',
        
        // Processing Steps
        satelliteData: 'सैटेलाइट डेटा',
        aiAnalysis: 'AI विश्लेषण',
        verification: 'सत्यापन',
        
        // Results
        claimApproved: 'दावा स्वीकृत!',
        claimId: 'दावा आईडी',
        processingTimeLabel: 'प्रसंस्करण समय',
        geoaiDamageScore: 'GeoAI क्षति स्कोर',
        estimatedPayout: 'अनुमानित भुगतान',
        
        // NDVI Evidence
        satelliteEvidence: 'सैटेलाइट साक्ष्य (NDVI विश्लेषण)',
        historicalNDVI: 'ऐतिहासिक NDVI (स्वस्थ)',
        currentNDVI: 'वर्तमान NDVI (क्षतिग्रस्त)',
        daysAgo: 'दिन पहले',
        latestScan: 'नवीनतम स्कैन',
        
        // Next Steps
        nextSteps: 'अगले कदम',
        step1Title: 'GeoAI सत्यापन पूर्ण',
        step1Desc: 'सैटेलाइट विश्लेषण पास',
        step2Title: 'समीक्षाधीन',
        step2Desc: 'बीमा कंपनी सत्यापन (1-2 दिन)',
        step3Title: 'भुगतान प्रसंस्करण',
        step3Desc: '3-5 व्यावसायिक दिनों के भीतर अपेक्षित',
        
        // Validation Messages
        selectPropertyError: 'कृपया एक संपत्ति चुनें',
        selectDamageError: 'कृपया क्षति का प्रकार चुनें',
        claimSuccess: 'दावा सफलतापूर्वक संसाधित!',
        claimFailed: 'दावा संसाधित करने में विफल'
      },

      // Document Verification Modal Hindi
      docVerification: {
        title: 'OCR + AI दस्तावेज़ सत्यापन',
        subtitle: '85%+ सटीकता के साथ स्वचालित सत्यापन',
        uploadTitle: 'भूमि दस्तावेज़ अपलोड करें (7/12, सर्वे दस्तावेज़, भूमि रिकॉर्ड) *',
        clickUpload: 'अपलोड करने के लिए क्लिक करें या ड्रैग करें',
        fileTypes: 'JPG, PNG या PDF (अधिकतम 10MB)',
        ownerName: 'मालिक का नाम *',
        ownerPlaceholder: 'दस्तावेज़ के अनुसार पूरा नाम दर्ज करें',
        surveyNumber: 'सर्वे नंबर / गट नंबर *',
        surveyPlaceholder: 'उदा., 123/1A',
        area: 'क्षेत्रफल (हेक्टेयर में) *',
        areaPlaceholder: 'उदा., 2.5',
        village: 'गांव',
        villagePlaceholder: 'गांव का नाम दर्ज करें',
        district: 'जिला',
        districtPlaceholder: 'जिले का नाम दर्ज करें',
        
        // Info Box
        howItWorks: 'यह कैसे काम करता है',
        info1: 'AI OCR का उपयोग करके आपके दस्तावेज़ से टेक्स्ट निकालता है',
        info2: 'निकाले गए डेटा की तुलना आपके इनपुट से करता है',
        info3: 'मैच स्कोर > 85% होने पर स्वतः स्वीकृत करता है',
        info4: 'मैनुअल सत्यापन की आवश्यकता नहीं!',
        
        // Buttons
        startVerification: 'AI सत्यापन शुरू करें',
        cancel: 'रद्द करें',
        close: 'बंद करें',
        
        // Processing
        processingTitle: 'AI आपके दस्तावेज़ का सत्यापन कर रहा है...',
        uploading: 'दस्तावेज़ अपलोड हो रहा है...',
        extracting: 'OCR का उपयोग करके टेक्स्ट निकाला जा रहा है...',
        processing: 'दस्तावेज़ डेटा संसाधित हो रहा है...',
        validating: 'AI के साथ मान्य किया जा रहा है...',
        comparing: 'निकाले गए डेटा की तुलना की जा रही है...',
        checkingDuplicates: 'डुप्लिकेट की जांच की जा रही है...',
        generatingReport: 'सत्यापन रिपोर्ट तैयार की जा रही है...',
        
        // Results
        verified: 'दस्तावेज़ सत्यापित! ✅',
        needsReview: 'समीक्षा आवश्यक ⚠️',
        failed: 'सत्यापन विफल ❌',
        matchScore: 'मैच स्कोर',
        aiConfidence: 'AI विश्वास',
        extractedFields: 'दस्तावेज़ से निकाला गया (OCR)',
        fieldAnalysis: 'फील्ड-दर-फील्ड विश्लेषण',
        continueVerified: 'सत्यापित दस्तावेज़ के साथ जारी रखें',
        submitReview: 'मैनुअल समीक्षा के लिए सबमिट करें',
        tryAgain: 'पुनः प्रयास करें',
        uploadDifferent: 'अलग दस्तावेज़ अपलोड करें',
        
        // Validation
        selectFile: 'कृपया सत्यापित करने के लिए एक दस्तावेज़ चुनें',
        fillFields: 'कृपया सभी आवश्यक फ़ील्ड भरें',
        invalidFileType: 'केवल JPG, PNG, और PDF फ़ाइलों की अनुमति है',
        fileTooLarge: 'फ़ाइल का आकार 10MB से कम होना चाहिए',
        verificationFailed: 'सत्यापन विफल'
      },

      // Farm Todo Hindi
      farmTodo: {
        title: 'खेत के कार्य',
        subtitle: 'अपनी दैनिक गतिविधियों को प्रबंधित करें',
        pending: 'लंबित',
        completed: 'पूर्ण',
        addTask: 'नया कार्य जोड़ें',
        
        // Form
        taskTitle: 'कार्य शीर्षक *',
        description: 'विवरण (वैकल्पिक)',
        lowPriority: '🟢 कम प्राथमिकता',
        mediumPriority: '🟡 मध्यम प्राथमिकता',
        highPriority: '🔴 उच्च प्राथमिकता',
        
        // Categories
        irrigation: '💧 सिंचाई',
        fertilizer: '🌱 उर्वरक',
        pestControl: '🐛 कीट नियंत्रण',
        harvesting: '🌾 कटाई',
        planting: '🌿 रोपण',
        maintenance: '🔧 रखरखाव',
        other: '📋 अन्य',
        
        // Actions
        updateTask: 'कार्य अपडेट करें',
        addTaskButton: 'कार्य जोड़ें',
        cancelButton: 'रद्द करें',
        deleteConfirm: 'इस कार्य को हटाएं?',
        
        // Messages
        taskRequired: 'कार्य शीर्षक आवश्यक है',
        taskUpdated: 'कार्य अपडेट किया गया!',
        taskAdded: 'कार्य जोड़ा गया!',
        taskCompleted: '🎉 कार्य पूर्ण हुआ!',
        taskReopened: 'कार्य पुनः खोला गया',
        taskDeleted: 'कार्य हटाया गया',
        failedLoad: 'कार्य लोड करने में विफल',
        failedSave: 'कार्य सहेजने में विफल',
        failedUpdate: 'कार्य अपडेट करने में विफल',
        failedDelete: 'कार्य हटाने में विफल',
        
        // Empty State
        noTasks: 'अभी तक कोई कार्य नहीं',
        addFirstTask: 'अपना पहला खेत कार्य जोड़ें!',
        loading: 'कार्य लोड हो रहे हैं...'
      },

      // Footer Hindi
      footer: {
        brandDescription: 'स्थायी कृषि के लिए AI-संचालित सैटेलाइट निगरानी, बीमा एकीकरण और स्मार्ट फार्म प्रबंधन समाधानों के साथ किसानों को सशक्त बनाना।',
        product: 'उत्पाद',
        features: 'विशेषताएं',
        pricing: 'मूल्य निर्धारण',
        documentation: 'दस्तावेज़ीकरण',
        api: 'API',
        company: 'कंपनी',
        aboutUs: 'हमारे बारे में',
        team: 'टीम',
        careers: 'करियर',
        blog: 'ब्लॉग',
        support: 'सहायता',
        helpCenter: 'सहायता केंद्र',
        contact: 'संपर्क करें',
        privacyPolicy: 'गोपनीयता नीति',
        termsOfService: 'सेवा की शर्तें',
        copyright: 'FarmView AI. SSPU हैकथॉन परियोजना। सर्वाधिकार सुरक्षित।',
        madeWithLove: 'भारतीय किसानों के लिए ❤️ से बनाया गया'
      },

      // Header Hindi (Additional items not in nav)
      header: {
        login: 'लॉगिन',
        signUp: 'साइन अप करें',
        claims: 'दावे',
        aiAdvisor: 'AI सलाहकार'
      },

      // Insurance Claim Component Hindi
      insuranceClaim: {
        title: 'बीमा दावा दर्ज करें',
        checkingEligibility: 'पात्रता जाँच रहे हैं...',
        notEligible: 'पात्र नहीं',
        close: 'बंद करें',
        activePolicy: 'सक्रिय बीमा पॉलिसी',
        policyNumber: 'पॉलिसी नंबर',
        coverage: 'कवरेज',
        validUntil: 'वैध तिथि तक',
        damagePercentage: 'नुकसान का प्रतिशत',
        damageReason: 'नुकसान का कारण',
        selectReason: '-- कारण चुनें --',
        description: 'विवरण',
        descriptionPlaceholder: 'अतिरिक्त जानकारी दें...',
        geoaiVerification: 'GeoAI सत्यापन',
        geoaiInfo: 'आपका दावा स्वचालित रूप से सैटेलाइट इमेजरी (NDVI विश्लेषण) का उपयोग करके सत्यापित किया जाएगा। यह मैनुअल निरीक्षण के बिना तेज और सटीक प्रसंस्करण सुनिश्चित करता है।',
        fileClaim: 'दावा दर्ज करें',
        cancel: 'रद्द करें',
        processing: 'प्रसंस्करण...',
        claimApproved: 'दावा स्वीकृत!',
        claimFiled: 'दावा दर्ज!',
        claimId: 'दावा आईडी',
        status: 'स्थिति',
        damageScore: 'क्षति स्कोर (GeoAI)',
        estimatedPayout: 'अनुमानित भुगतान',
        processingTime: 'प्रसंस्करण समय',
        geoaiEvidence: 'GeoAI साक्ष्य',
        currentNDVI: 'वर्तमान NDVI',
        historicalNDVI: 'ऐतिहासिक NDVI',
        source: 'स्रोत',
        sentinelSatellite: 'सेंटिनल-2 सैटेलाइट',
        selectReasonError: 'कृपया नुकसान का कारण चुनें'
      },

      // Satellite Components Hindi
      satellite: {
        satelliteAnalysis: 'सैटेलाइट विश्लेषण',
        ndviHeatmap: 'NDVI हीटमैप',
        sentinelImage: 'सेंटिनल छवि',
        googleMapsSatellite: 'गूगल मैप्स सैटेलाइट',
        loading: 'लोड हो रहा है...',
        error: 'त्रुटि',
        fieldHealth: 'फील्ड स्वास्थ्य',
        healthyCoverage: 'स्वस्थ कवरेज',
        cropHealthIndicator: 'फसल स्वास्थ्य संकेतक',
        excellent: 'उत्कृष्ट',
        good: 'अच्छा',
        fair: 'सामान्य',
        poor: 'खराब',
        excellentMessage: 'आपकी फसलें उत्कृष्ट स्वास्थ्य में हैं!',
        goodMessage: 'फसलें अच्छी हैं, नियमित निगरानी करें',
        fairMessage: 'कुछ क्षेत्रों पर ध्यान देने की आवश्यकता है',
        poorMessage: 'तत्काल कार्रवाई की आवश्यकता है!',
        currentNDVI: 'वर्तमान NDVI',
        vegetationHealth: 'वनस्पति स्वास्थ्य',
        ndviRange: 'NDVI रेंज',
        stressedAreas: 'तनावग्रस्त क्षेत्र',
        ndviColorScale: 'NDVI रंग पैमाना',
        last30Days: 'पिछले 30 दिन',
        whatIsNDVI: 'NDVI क्या है?',
        ndviDescription: 'NDVI (नॉर्मलाइज्ड डिफरेंस वेजिटेशन इंडेक्स) पौधों के स्वास्थ्य को मापता है कि वे कैसे निकट-अवरक्त और लाल प्रकाश को प्रतिबिंबित करते हैं। मान -1 से +1 तक होते हैं, जहां उच्च मान स्वस्थ, घनी वनस्पति को दर्शाते हैं।',
        interpretation: 'व्याख्या:',
        greenZones: 'हरे क्षेत्र: स्वस्थ फसलें, अच्छी वृद्धि',
        yellowZones: 'पीले क्षेत्र: मध्यम तनाव, बारीकी से निगरानी करें',
        brownZones: 'भूरे क्षेत्र: नंगी मिट्टी या तनावग्रस्त फसलें',
        blueZones: 'नीले क्षेत्र: जल निकाय या बहुत कम वनस्पति',
        trueColorImage: 'ट्रू कलर सैटेलाइट छवि',
        imageDetails: 'छवि विवरण',
        property: 'संपत्ति',
        resolution: 'रेजोल्यूशन',
        format: 'प्रारूप',
        source: 'स्रोत',
        proTip: 'प्रो टिप:',
        proTipMessage: 'सटीक फसल स्वास्थ्य मूल्यांकन के लिए NDVI विश्लेषण का उपयोग करें। ट्रू कलर छवि फील्ड स्थितियों के दृश्य निरीक्षण के लिए उपयोगी है।',
        googleMapsView: 'गूगल मैप्स सैटेलाइट दृश्य',
        googleMapsDescription: 'गूगल मैप्स द्वारा संचालित उच्च-रिज़ॉल्यूशन सैटेलाइट इमेजरी',
        aboutGoogleMaps: 'गूगल मैप्स दृश्य के बारे में',
        googleMapsInfo: 'यह इंटरैक्टिव मैप बेहतर ज़ूम स्तर और स्पष्टता के लिए गूगल मैप्स सैटेलाइट इमेजरी का उपयोग करता है। आप ज़ूम इन/आउट कर सकते हैं, मैप प्रकार बदल सकते हैं, और अपने फील्ड के आसपास के क्षेत्र का पता लगा सकते हैं।',
        noDataLoaded: 'कोई सैटेलाइट डेटा लोड नहीं हुआ',
        clickToFetch: 'सैटेलाइट इमेजरी या NDVI विश्लेषण प्राप्त करने के लिए ऊपर एक बटन पर क्लिक करें',
        satellite: 'सैटेलाइट',
        hybrid: 'हाइब्रिड',
        roadmap: 'रोडमैप',
        zoom: 'ज़ूम'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
