import ModernNavigation from "@/components/ModernNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ValidatedInput } from "@/components/ValidatedInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Phone, MapPin, FileText, Upload, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormFieldWithError, validateField, scrollToFirstError } from "@/components/FormFieldWithError";
import { cn } from "@/lib/utils";
import { EmailHelpSection } from "@/components/EmailHelpSection";

const RegisterTeacher = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    nic: "",
    birthCertificateNo: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    province: "",
    postalCode: "",
    country: "Sri Lanka",
    imageUrl: "",
    idUrl: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    newErrors.firstName = validateField(formData.firstName, { required: true, maxLength: 50 }) || "";
    newErrors.lastName = validateField(formData.lastName, { required: true, maxLength: 50 }) || "";
    newErrors.email = validateField(formData.email, { required: true, email: true }) || "";
    newErrors.password = validateField(formData.password, { required: true, minLength: 8 }) || "";
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
        <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800 dark:text-red-400 font-bold">Teacher Registration - Contact Institute Required</AlertTitle>
        </Alert>

        <Card className="backdrop-blur-xl bg-card/95 border border-border/50 shadow-2xl opacity-75">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Teacher Registration
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-muted-foreground">
              Join as an educator and inspire the next generation of learners
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
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
                      placeholder="ENTER YOUR FIRST NAME"
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
                      placeholder="ENTER YOUR LAST NAME"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <FormFieldWithError
                    label="Birth Certificate No"
                    id="field-birthCertificateNo"
                  >
                    <Input
                      id="birthCertificateNo"
                      value={formData.birthCertificateNo}
                      onChange={(e) => setFormData({...formData, birthCertificateNo: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="123456789"
                    />
                  </FormFieldWithError>
                </div>
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

                <FormFieldWithError
                  label="Password"
                  required
                  error={errors.password}
                  id="field-password"
                >
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={cn("bg-background/50 border-border/50", errors.password && "border-destructive ring-2 ring-destructive/20")}
                    placeholder="Enter secure password (min 8 characters)"
                  />
                </FormFieldWithError>
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
                      placeholder="Enter street address"
                      maxLength={100}
                    />
                  </FormFieldWithError>
                  
                  <FormFieldWithError
                    label="Address Line 2 (Optional)"
                    id="field-addressLine2"
                  >
                    <Input
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Apartment, suite, etc."
                    />
                  </FormFieldWithError>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormFieldWithError
                      label="City"
                      required
                      error={errors.city}
                      maxLength={50}
                      currentLength={formData.city.length}
                      id="field-city"
                    >
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className={cn("bg-background/50 border-border/50", errors.city && "border-destructive ring-2 ring-destructive/20")}
                        placeholder="Enter city"
                        maxLength={50}
                      />
                    </FormFieldWithError>
                    
                    <FormFieldWithError
                      label="District"
                      required
                      error={errors.district}
                      id="field-district"
                    >
                      <Select 
                        value={formData.district}
                        onValueChange={(value) => setFormData({...formData, district: value})}
                      >
                        <SelectTrigger className={cn("bg-background/50 border-border/50", errors.district && "border-destructive ring-2 ring-destructive/20")}>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border max-h-60">
                          <SelectItem value="COLOMBO">Colombo</SelectItem>
                          <SelectItem value="GAMPAHA">Gampaha</SelectItem>
                          <SelectItem value="KALUTARA">Kalutara</SelectItem>
                          <SelectItem value="KANDY">Kandy</SelectItem>
                          <SelectItem value="MATALE">Matale</SelectItem>
                          <SelectItem value="NUWARA_ELIYA">Nuwara Eliya</SelectItem>
                          <SelectItem value="GALLE">Galle</SelectItem>
                          <SelectItem value="MATARA">Matara</SelectItem>
                          <SelectItem value="HAMBANTOTA">Hambantota</SelectItem>
                          <SelectItem value="JAFFNA">Jaffna</SelectItem>
                          <SelectItem value="KILINOCHCHI">Kilinochchi</SelectItem>
                          <SelectItem value="MANNAR">Mannar</SelectItem>
                          <SelectItem value="MULLAITIVU">Mullaitivu</SelectItem>
                          <SelectItem value="VAVUNIYA">Vavuniya</SelectItem>
                          <SelectItem value="TRINCOMALEE">Trincomalee</SelectItem>
                          <SelectItem value="BATTICALOA">Batticaloa</SelectItem>
                          <SelectItem value="AMPARA">Ampara</SelectItem>
                          <SelectItem value="KURUNEGALA">Kurunegala</SelectItem>
                          <SelectItem value="PUTTALAM">Puttalam</SelectItem>
                          <SelectItem value="ANURADHAPURA">Anuradhapura</SelectItem>
                          <SelectItem value="POLONNARUWA">Polonnaruwa</SelectItem>
                          <SelectItem value="BADULLA">Badulla</SelectItem>
                          <SelectItem value="MONARAGALA">Monaragala</SelectItem>
                          <SelectItem value="RATNAPURA">Ratnapura</SelectItem>
                          <SelectItem value="KEGALLE">Kegalle</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormFieldWithError>
                    
                    <FormFieldWithError
                      label="Province"
                      required
                      error={errors.province}
                      id="field-province"
                    >
                      <Select 
                        value={formData.province}
                        onValueChange={(value) => setFormData({...formData, province: value})}
                      >
                        <SelectTrigger className={cn("bg-background/50 border-border/50", errors.province && "border-destructive ring-2 ring-destructive/20")}>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border">
                          <SelectItem value="WESTERN">Western</SelectItem>
                          <SelectItem value="CENTRAL">Central</SelectItem>
                          <SelectItem value="SOUTHERN">Southern</SelectItem>
                          <SelectItem value="NORTHERN">Northern</SelectItem>
                          <SelectItem value="EASTERN">Eastern</SelectItem>
                          <SelectItem value="NORTH_WESTERN">North Western</SelectItem>
                          <SelectItem value="NORTH_CENTRAL">North Central</SelectItem>
                          <SelectItem value="UVA">Uva</SelectItem>
                          <SelectItem value="SABARAGAMUWA">Sabaragamuwa</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormFieldWithError>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldWithError
                      label="Postal Code"
                      error={errors.postalCode}
                      maxLength={10}
                      currentLength={formData.postalCode.length}
                      id="field-postalCode"
                    >
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        className={cn("bg-background/50 border-border/50", errors.postalCode && "border-destructive")}
                        placeholder="Enter postal code"
                        maxLength={10}
                      />
                    </FormFieldWithError>
                    
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
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Profile Image</Label>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload profile image</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>ID Document</Label>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload ID document</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  type="submit"
                  size="lg" 
                  className="px-8 py-3 text-lg" 
                  disabled
                  title="Registration currently disabled - Contact your institute or support"
                >
                  Register As a Teacher (Disabled)
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterTeacher;
