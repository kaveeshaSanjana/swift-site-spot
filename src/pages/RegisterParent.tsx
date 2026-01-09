import { env } from "@/config/env";
import ModernNavigation from "@/components/ModernNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ValidatedInput } from "@/components/ValidatedInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Phone, MapPin, Briefcase, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SimpleLocationSelector } from "@/components/SimpleLocationSelector";
import { FormFieldWithError, validateField, scrollToFirstError } from "@/components/FormFieldWithError";
import { cn } from "@/lib/utils";
import { EmailHelpSection } from "@/components/EmailHelpSection";

const RegisterParent = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    nic: "",
    addressLine1: "",
    city: "",
    district: "",
    province: "",
    postalCode: "",
    country: "Sri Lanka",
    occupation: "",
    workplace: "",
    workPhone: "",
    educationLevel: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    newErrors.firstName = validateField(formData.firstName, { required: true, maxLength: 50 }) || "";
    newErrors.lastName = validateField(formData.lastName, { required: true, maxLength: 50 }) || "";
    newErrors.email = validateField(formData.email, { required: true, email: true }) || "";
    newErrors.phoneNumber = validateField(formData.phoneNumber, { required: true, phone: true }) || "";
    newErrors.dateOfBirth = validateField(formData.dateOfBirth, { required: true }) || "";
    newErrors.gender = validateField(formData.gender, { required: true }) || "";
    newErrors.addressLine1 = validateField(formData.addressLine1, { required: true, maxLength: 100 }) || "";
    newErrors.city = validateField(formData.city, { required: true, maxLength: 50 }) || "";
    newErrors.district = validateField(formData.district, { required: true }) || "";
    newErrors.province = validateField(formData.province, { required: true }) || "";

    if (formData.nic) {
      newErrors.nic = validateField(formData.nic, { maxLength: 12 }) || "";
    }
    if (formData.postalCode) {
      newErrors.postalCode = validateField(formData.postalCode, { maxLength: 10 }) || "";
    }

    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== "")
    );

    setErrors(filteredErrors);

    if (Object.keys(filteredErrors).length > 0) {
      scrollToFirstError(filteredErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    // Form is valid, proceed with submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <ModernNavigation />
      
      <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <img 
            src={env.logoUrl} 
            alt="SurakshaLMS Logo" 
            className="h-20 md:h-24 object-contain"
          />
        </div>

        <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800 dark:text-red-400 font-bold">Parent Registration - Contact Institute Required</AlertTitle>
        </Alert>

        <Card className="backdrop-blur-xl bg-card/95 border border-border/50 shadow-2xl opacity-75">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Parent Registration
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-muted-foreground">
              Join our community to support your child's educational journey
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldWithError
                    label="First Name (e.g., HEWAGE MUDIYANSELAGE APPUHAMY)"
                    required
                    error={errors.firstName}
                    maxLength={50}
                    currentLength={formData.firstName.length}
                    id="field-firstName"
                  >
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z ]/g, '').replace(/  +/g, ' ');
                        setFormData({...formData, firstName: value});
                      }}
                      className={cn("bg-background/50 border-border/50", errors.firstName && "border-destructive ring-2 ring-destructive/20")}
                      placeholder="ENTER FIRST NAME"
                      maxLength={50}
                    />
                  </FormFieldWithError>
                  
                  <FormFieldWithError
                    label="Last Name (e.g., DON GAMAGE)"
                    required
                    error={errors.lastName}
                    maxLength={50}
                    currentLength={formData.lastName.length}
                    id="field-lastName"
                  >
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z ]/g, '').replace(/  +/g, ' ');
                        setFormData({...formData, lastName: value});
                      }}
                      className={cn("bg-background/50 border-border/50", errors.lastName && "border-destructive ring-2 ring-destructive/20")}
                      placeholder="ENTER LAST NAME"
                      maxLength={50}
                    />
                  </FormFieldWithError>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldWithError
                    label="Date of Birth"
                    required
                    error={errors.dateOfBirth}
                    id="field-dateOfBirth"
                  >
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className={cn("bg-background/50 border-border/50", errors.dateOfBirth && "border-destructive ring-2 ring-destructive/20")}
                    />
                  </FormFieldWithError>
                  
                  <FormFieldWithError
                    label="Gender"
                    required
                    error={errors.gender}
                    id="field-gender"
                  >
                    <Select 
                      value={formData.gender}
                      onValueChange={(value) => setFormData({...formData, gender: value})}
                    >
                      <SelectTrigger className={cn("bg-background/50 border-border/50", errors.gender && "border-destructive ring-2 ring-destructive/20")}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormFieldWithError>
                </div>

                <FormFieldWithError
                  label="NIC Number"
                  error={errors.nic}
                  maxLength={12}
                  currentLength={formData.nic.length}
                  id="field-nic"
                >
                  <Input
                    id="nic"
                    value={formData.nic}
                    onChange={(e) => setFormData({...formData, nic: e.target.value})}
                    className={cn("bg-background/50 border-border/50", errors.nic && "border-destructive ring-2 ring-destructive/20")}
                    placeholder="Enter NIC number"
                    maxLength={12}
                  />
                </FormFieldWithError>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormFieldWithError
                      label="Email Address"
                      required
                      error={errors.email}
                      id="field-email"
                    >
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={cn("bg-background/50 border-border/50", errors.email && "border-destructive ring-2 ring-destructive/20")}
                        placeholder="Enter email address"
                      />
                    </FormFieldWithError>
                    <EmailHelpSection />
                  </div>
                  
                  <FormFieldWithError
                    label="Phone Number"
                    required
                    error={errors.phoneNumber}
                    id="field-phoneNumber"
                  >
                    <PhoneInput
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(value) => setFormData({...formData, phoneNumber: value})}
                      className={cn("bg-background/50 border-border/50", errors.phoneNumber && "phone-input-error")}
                    />
                  </FormFieldWithError>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldWithError
                    label="Occupation"
                    id="field-occupation"
                  >
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Enter occupation"
                    />
                  </FormFieldWithError>
                  
                  <FormFieldWithError
                    label="Workplace"
                    id="field-workplace"
                  >
                    <Input
                      id="workplace"
                      value={formData.workplace}
                      onChange={(e) => setFormData({...formData, workplace: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Enter workplace"
                    />
                  </FormFieldWithError>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldWithError
                    label="Work Phone"
                    id="field-workPhone"
                  >
                    <PhoneInput
                      id="workPhone"
                      value={formData.workPhone}
                      onChange={(value) => setFormData({...formData, workPhone: value})}
                      className="bg-background/50 border-border/50"
                    />
                  </FormFieldWithError>
                  
                  <FormFieldWithError
                    label="Education Level"
                    id="field-educationLevel"
                  >
                    <Select 
                      value={formData.educationLevel}
                      onValueChange={(value) => setFormData({...formData, educationLevel: value})}
                    >
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                        <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                        <SelectItem value="Doctorate">Doctorate</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormFieldWithError>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Address Information
                </h3>
                
                <div className="space-y-4">
                  <FormFieldWithError
                    label="Address Line 1"
                    required
                    error={errors.addressLine1}
                    maxLength={100}
                    currentLength={formData.addressLine1.length}
                    id="field-addressLine1"
                  >
                    <Input
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                      className={cn("bg-background/50 border-border/50", errors.addressLine1 && "border-destructive ring-2 ring-destructive/20")}
                      placeholder="Enter address"
                      maxLength={100}
                    />
                  </FormFieldWithError>

                  <SimpleLocationSelector
                    province={formData.province}
                    district={formData.district}
                    city={formData.city}
                    postalCode={formData.postalCode}
                    onProvinceChange={(value) => setFormData({ ...formData, province: value })}
                    onDistrictChange={(value) => setFormData({ ...formData, district: value })}
                    onCityChange={(value) => setFormData({ ...formData, city: value })}
                    onPostalCodeChange={(value) => setFormData({ ...formData, postalCode: value })}
                    errors={{
                      province: errors.province,
                      district: errors.district,
                      city: errors.city,
                      postalCode: errors.postalCode
                    }}
                  />

                  <FormFieldWithError
                    label="Country"
                    id="field-country"
                  >
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="bg-background/50 border-border/50"
                      disabled
                    />
                  </FormFieldWithError>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  type="submit"
                  size="lg" 
                  className="px-8 py-3 text-lg" 
                  disabled
                  title="Registration currently disabled - Contact your child's institute or support"
                >
                  Register As a Parent (Disabled)
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterParent;
