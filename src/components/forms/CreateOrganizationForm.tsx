
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { OrganizationCreateData } from '@/api/organization.api';
import { getBaseUrl } from '@/contexts/utils/auth.api';
import OrganizationImageUpload from '@/components/OrganizationImageUpload';

const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  type: z.enum(['INSTITUTE', 'GLOBAL']),
  enrollmentKey: z.string().max(50, 'Enrollment key must be less than 50 characters').optional(),
  isPublic: z.boolean().default(true),
  needEnrollmentVerification: z.boolean().default(true),
  enabledEnrollments: z.boolean().default(true),
  instituteId: z.string().optional()
}).refine((data) => {
  if (data.type === 'INSTITUTE') {
    return data.enrollmentKey && data.enrollmentKey.trim().length > 0;
  }
  return true;
}, {
  message: 'Enrollment key is required for institute organizations',
  path: ['enrollmentKey']
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface CreateOrganizationFormProps {
  onSuccess?: (organization: any) => void;
  onCancel?: () => void;
  instituteId?: string;
  instituteName?: string;
}

const CreateOrganizationForm = ({ onSuccess, onCancel, instituteId, instituteName }: CreateOrganizationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { toast } = useToast();

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      type: 'INSTITUTE',
      enrollmentKey: '',
      isPublic: true,
      needEnrollmentVerification: true,
      enabledEnrollments: true,
      instituteId: instituteId || ''
    }
  });

  const watchType = form.watch('type');

  const handleSubmit = async (data: OrganizationFormData) => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      
      const requestBody = {
        name: data.name,
        type: data.type,
        isPublic: data.isPublic,
        needEnrollmentVerification: data.needEnrollmentVerification,
        enabledEnrollments: data.enabledEnrollments,
        enrollmentKey: data.enrollmentKey || undefined,
        instituteId: data.instituteId || instituteId || undefined,
        imageUrl: imageUrl || undefined
      };
      
      const response = await fetch(`${getBaseUrl()}/organizations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create organization');
      }
      
      const organization = await response.json();
      
      toast({
        title: "Success",
        description: `Organization "${organization.name}" created successfully`,
      });
      
      if (onSuccess) {
        onSuccess(organization);
      }
    } catch (error) {
      console.error('Error creating organization:', error);
      
      let errorMessage = "Failed to create organization";
      
      if (error instanceof Error) {
        if (error.message.includes("Only Organization Managers, Super Admins, or Institute Admins")) {
          errorMessage = "You don't have permission to create organizations. Please contact your administrator.";
        } else if (error.message.includes("Forbidden")) {
          errorMessage = "Access denied. You need Institute Admin permissions to create organizations.";
        } else if (error.message.includes("already exists")) {
          errorMessage = "An organization with this name already exists.";
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Cannot Create Organization",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Organization</CardTitle>
        <CardDescription>Enter organization information to create a new record</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter organization name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="INSTITUTE">Institute</SelectItem>
                        <SelectItem value="GLOBAL">Global</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enrollmentKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enrollment Key {watchType === 'INSTITUTE' ? '*' : '(Optional)'}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={watchType === 'INSTITUTE' ? "Enter secret key" : "Optional key"} 
                        {...field} 
                        disabled={watchType !== 'INSTITUTE'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {instituteId ? (
                <FormItem>
                  <FormLabel>Linked Institute</FormLabel>
                  <div className="flex items-center gap-2 p-3 rounded-md border bg-muted/50">
                    <span className="text-sm font-medium">{instituteName || instituteId}</span>
                  </div>
                </FormItem>
              ) : (
                <FormField
                  control={form.control}
                  name="instituteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institute ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter institute ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="space-y-2">
              <FormLabel>Organization Image (Optional)</FormLabel>
              <OrganizationImageUpload
                currentImageUrl={imageUrl}
                onImageUpdate={(newImageUrl) => setImageUrl(newImageUrl)}
                organizationName={form.watch('name')}
              />
            </div>

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Public Organization</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Anyone can view this organization
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="needEnrollmentVerification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Require Verification</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      New members need approval to join
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enabledEnrollments"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Enrollments</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Allow new members to join
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Organization'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateOrganizationForm;
